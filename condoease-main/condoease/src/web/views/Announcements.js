import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { useUser } from '../../context/UserContext'
// import socket from '../../shared/socket'

const Announcements = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [announcements, setAnnouncements] = useState([])
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const [editForm, setEditForm] = useState({
    id: null,
    title: '',
    description: '',
    file: null,
    file_url: '',
  })

  const [searchTerm, setSearchTerm] = useState('')

  const filteredAnnouncements = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    if (!normalizedSearch) return announcements

    return announcements.filter((ann) => {
      const title = ann.title?.toLowerCase() || ''
      const description = ann.description?.toLowerCase() || ''
      return title.includes(normalizedSearch) || description.includes(normalizedSearch)
    })
  }, [announcements, searchTerm])

  const handleCardClick = (announcement) => {
    setEditForm({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      file: null,
      file_url: announcement.file_url || '',
    })
    setPreviewUrl(null)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setEditForm((prev) => ({ ...prev, file: selectedFile }))
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handlePostAnnouncement = async () => {
    if (!title || !description) return alert('Please fill in all fields.')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    //formData.append('userId', user.id) // Ensure user ID is sent
    if (file) formData.append('file', file)
    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!res.ok) throw new Error('Failed to post announcement')
      alert('Announcement Posted!')

      // const newAnnouncement = await res.json()
      // setAnnouncements((prev) => [newAnnouncement, ...prev])
      setTitle('')
      setDescription('')
      setFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error(err)
      alert('Error posting announcement.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editForm.title || !editForm.description) return alert('Please fill in all fields.')

    const formData = new FormData()
    formData.append('title', editForm.title)
    formData.append('description', editForm.description)
    if (editForm.file) formData.append('file', editForm.file)

    try {
      const res = await fetch(`${API_URL}/api/announcements/${editForm.id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!res.ok) throw new Error(await res.text())

      const updated = await res.json()
      setAnnouncements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      setEditForm({ id: null, title: '', description: '', file: null, file_url: '' })
      setPreviewUrl(null)
    } catch (err) {
      console.error(err)
      alert('Failed to update announcement.')
    }
  }

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return

    try {
      const res = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!res.ok) throw new Error('Delete failed')

      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      if (editForm.id === id) {
        setEditForm({ id: null, title: '', description: '', file: null, file_url: '' })
        setPreviewUrl(null)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to delete announcement.')
    }
  }

  useEffect(() => {
    if (!API_URL) return

    const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws'
    const wsUrl = `${wsProtocol}://${API_URL.replace(/^https?:\/\//, '')}/ws/announcements`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('Announcements WebSocket connected')
    }
    ws.onmessage = (msg) => {
      try {
        const { event, data } = JSON.parse(msg.data)

        if (event === 'new_announcement') {
          setAnnouncements((prev) => {
            const exists = prev.some((a) => a.id === data.id)
            return exists ? prev : [data, ...prev]
          })
        }
      } catch (e) {
        console.error('Invalid WS message', e)
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error', err)
    }
    ws.onclose = () => {
      console.log('Announcements WebSocket closed')
    }
    return () => {
      ws.close()
    }
  }, [API_URL])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${API_URL}/api/announcements?userId=${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setAnnouncements(response.data)
      } catch (err) {
        console.error('Error fetching announcements:', err)
      } finally {
        setLoading(false)
      }
    }
    if (user?.id) fetchAnnouncements()
  }, [user])

  if (!user) {
    return (
      <div className="text-center mt-5">
        <h2>User data not found.</h2>
        <p>Please navigate from the dashboard or log in again.</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Announcements</h4>
      <div className="mb-3">
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/cards')}
        >
          DASHBOARD
        </span>{' '}
        / <span style={{ color: '#F28D35' }}>ANNOUNCEMENTS</span>
      </div>
      {/* Post Section */}
      <CCard className="mb-4">
        <CCardHeader>Post New Announcements</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <CForm>
                <CFormInput
                  type="text"
                  placeholder="Announcement Title"
                  className="mb-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <CFormTextarea
                  rows="5"
                  placeholder="Announcement Description"
                  className="mb-3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <CFormInput
                  type="file"
                  className="d-none"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </CForm>
            </CCol>
            <CCol md={6} className="text-center">
              <p>Image / Video Attachment:</p>
              <CButton
                className="text-white mb-3"
                onClick={() => fileInputRef.current.click()}
                style={{ backgroundColor: '#F28D35', fontWeight: 'bold' }}
              >
                Choose File
              </CButton>
              <div className="border p-3 text-body-secondary">
                {file ? file.name : 'No attached files'}
              </div>
              {previewUrl &&
                (file?.type?.startsWith('image/') ? (
                  <img src={previewUrl} alt="Preview" width="200" />
                ) : file?.type?.startsWith('video/') ? (
                  <video width="320" height="240" controls>
                    <source src={previewUrl} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p>File preview not available</p>
                ))}
            </CCol>
          </CRow>
          <div className="d-flex justify-content-end mt-3">
            <CButton
              color="secondary"
              className="me-2"
              style={{ fontWeight: 'bold' }}
              onClick={() => {
                setTitle('')
                setDescription('')
                setFile(null)
                setPreviewUrl(null)
              }}
            >
              Cancel
            </CButton>
            <CButton
              className="text-white fw-bold px-4"
              onClick={handlePostAnnouncement}
              disabled={submitting}
              style={{
                fontSize: 20,
                backgroundColor: '#F28D35',
                minWidth: '205px',
                display: 'inline-flex',
                justifyContent: 'center',
              }}
            >
              {submitting ? (
                <CSpinner style={{ width: '1.9rem', height: '1.9rem', color: '#FFFFFF' }} />
              ) : (
                'Post Announcement'
              )}
            </CButton>
          </div>
        </CCardBody>
      </CCard>
      {/* Announcement List */}
      <CRow>
        <CCol md={4}>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Search Announcements"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
          {loading ? (
            <p>Loading announcement list...</p>
          ) : filteredAnnouncements.length > 0 ? (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {filteredAnnouncements.map((ann) => (
                <CCard
                  key={ann.id}
                  className={`mb-3 ${editForm.id === ann.id ? 'border-warning' : 'border-success'}`}
                  onClick={() => handleCardClick(ann)}
                  style={{ cursor: 'pointer' }}
                >
                  <CCardBody>
                    <h6>{ann.title}</h6>
                    <p className="text-body-secondary small">{ann.description}</p>
                    {ann.created_at && (
                      <p className="text-body-secondary small">
                        {new Date(ann.created_at).toLocaleString()}
                      </p>
                    )}
                  </CCardBody>
                </CCard>
              ))}
            </div>
          ) : (
            <p>No announcements found.</p>
          )}
        </CCol>
        {/* Edit Form */}
        {editForm.id && (
          <CCol md={8}>
            <CCard className="mb-4 border-warning">
              <CCardHeader>Edit Announcement</CCardHeader>
              <CCardBody>
                <CForm>
                  <CFormInput
                    type="text"
                    placeholder="Announcement Title"
                    className="mb-3"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                  <CFormTextarea
                    rows="5"
                    placeholder="Edit description here..."
                    className="mb-3"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                  <CFormInput type="file" className="mb-3" onChange={handleFileChange} />
                  {editForm.file_url && !previewUrl && (
                    <p>
                      Current File:{' '}
                      <a
                        href={`${API_URL}${editForm.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </p>
                  )}
                  <div className="d-flex justify-content-between">
                    <CButton
                      className="me-2"
                      style={{ backgroundColor: '#EE3030', color: 'white', fontWeight: 'bold' }}
                      onClick={() => handleDeleteAnnouncement(editForm.id)}
                    >
                      Delete
                    </CButton>
                    <div>
                      <CButton
                        color="secondary"
                        className="me-2"
                        style={{ fontWeight: 'bold' }}
                        onClick={() => {
                          setEditForm({
                            id: null,
                            title: '',
                            description: '',
                            file: null,
                            file_url: '',
                          })
                          setPreviewUrl(null)
                        }}
                      >
                        Cancel
                      </CButton>
                      <CButton
                        style={{ backgroundColor: '#F28D35', fontWeight: 'bold' }}
                        className="text-white"
                        onClick={handleSaveEdit}
                      >
                        Save Changes
                      </CButton>
                    </div>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        )}
      </CRow>
    </div>
  )
}

export default Announcements
