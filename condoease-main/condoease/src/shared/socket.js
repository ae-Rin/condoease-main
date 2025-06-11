import { io } from 'socket.io-client'

// ✅ Use relative path to enable Vite proxy support
const socket = io('/', {
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
})

export default socket
