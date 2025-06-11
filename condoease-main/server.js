const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const http = require('http') // 🆕 for HTTP server
const { Server } = require('socket.io') // 🆕 Socket.IO
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.244.63:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
})

const JWT_SECRET = process.env.JWT_SECRET

// Middleware
app.use(cors())
app.use(express.json())

// Ensure uploads directory exists
const uploadDir = path.resolve(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
app.use('/uploads', express.static(uploadDir))

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/\s+/g, '_').replace(/[^\w.-]/g, '')
    cb(null, Date.now() + '-' + sanitized)
  },
})
const upload = multer({ storage })

// DB connection
let db
async function initDb() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'condoeasedb',
      port: 3306,
    })
    console.log('Connected to MySQL')
  } catch (err) {
    console.error('DB connection error:', err)
  }
}
initDb()

// JWT Auth middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// 📝 Register
app.post('/api/registerstep2', async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword]
    )
    res.json({ success: true })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: err.message })
  }
})

// 🔐 Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    if (!rows.length) return res.status(401).json({ error: 'Invalid email or password' })

    const user = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Invalid email or password' })

    const [announcements] = await db.query(
      'SELECT * FROM post_announcements WHERE user_id = ? ORDER BY created_at DESC',
      [user.id]
    )

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar || null,
        announcements,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// 📸 Update avatar
app.put('/api/users/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  const userId = req.user.id
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const avatarPath = `/uploads/${req.file.filename}`

  try {
    await db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, userId])
    res.json({ avatar: avatarPath })
  } catch (err) {
    console.error('Avatar update error:', err)
    res.status(500).json({ error: 'Failed to update avatar' })
  }
})

// ✏️ Update user profile (name, email, password)
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { firstName, lastName, email, password, currentPassword } = req.body

  try {
    const fields = []
    const values = []

    // Fetch user first to verify password if needed
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [id])
    if (!rows.length) return res.status(404).json({ error: 'User not found' })
    const storedHashedPassword = rows[0].password

    // Update name
    if (firstName && lastName) {
      fields.push('first_name = ?', 'last_name = ?')
      values.push(firstName, lastName)
    }

    // Update email
    if (email && password) {
      const match = await bcrypt.compare(password, storedHashedPassword)
      if (!match) return res.status(401).json({ error: 'Incorrect password' })
      fields.push('email = ?')
      values.push(email)
    }

    // Update password
    if (currentPassword && password && currentPassword !== password) {
      const match = await bcrypt.compare(currentPassword, storedHashedPassword)
      if (!match) return res.status(401).json({ error: 'Incorrect current password' })
      const hashedNewPassword = await bcrypt.hash(password, 10)
      fields.push('password = ?')
      values.push(hashedNewPassword)
    }

    if (!fields.length) {
      return res.status(400).json({ error: 'No valid fields provided for update' })
    }

    values.push(id)
    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)

    res.json({ success: true, updated: { firstName, lastName, email } })
  } catch (err) {
    console.error('User update error:', err)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// 📌 Create announcement
app.post('/api/announcements', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' })
    }

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null
    const userId = req.user.id

    const [result] = await db.query(
      'INSERT INTO post_announcements (title, description, file_url, user_id) VALUES (?, ?, ?, ?)',
      [title, description, fileUrl, userId]
    )

    const [newPost] = await db.query('SELECT * FROM post_announcements WHERE id = ?', [result.insertId])
    const created = newPost[0]

    io.emit('new_announcement', created)
    res.json(created)
  } catch (err) {
    console.error('Announcement insert error:', err)
    res.status(500).json({ error: err.message })
  }
})

// 📌 Get announcements
app.get('/api/announcements', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM post_announcements WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✏️ Update announcement
app.put('/api/announcements/:id', authenticateToken, upload.single('file'), async (req, res) => {
  const { id } = req.params
  const { title, description } = req.body
  const newFile = req.file ? `/uploads/${req.file.filename}` : null

  try {
    const [rows] = await db.query('SELECT file_url FROM post_announcements WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Announcement not found' })

    const oldFileUrl = rows[0]?.file_url
    const fileToUse = newFile || oldFileUrl

    await db.query(
      'UPDATE post_announcements SET title = ?, description = ?, file_url = ? WHERE id = ?',
      [title, description, fileToUse, id]
    )

    if (newFile && oldFileUrl && oldFileUrl !== newFile) {
      const filePath = path.join(__dirname, oldFileUrl)
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete old file:', err)
      })
    }

    const [updated] = await db.query('SELECT * FROM post_announcements WHERE id = ?', [id])
    io.emit('announcement_updated', updated[0]) // 🔥 Emit updated
    res.json(updated[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update announcement.' })
  }
})

// ❌ Delete announcement
app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query('SELECT file_url FROM post_announcements WHERE id = ?', [id])
    const fileUrl = rows[0]?.file_url

    await db.query('DELETE FROM post_announcements WHERE id = ?', [id])

    if (fileUrl) {
      const filePath = path.join(__dirname, fileUrl)
      fs.unlink(filePath, (err) => {
        if (err) console.error('File delete error:', err)
      })
    }

    io.emit('announcement_deleted', { id: parseInt(id) }) // 🔥 Emit deletion
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 👥 Get users
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, first_name, last_name, email, avatar FROM users')
    res.json(rows)
  } catch (err) {
    console.error('Failed to fetch users:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('🔌 A client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('❌ A client disconnected:', socket.id)
  })
})

// Export io if needed for emitting elsewhere
module.exports = io

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});