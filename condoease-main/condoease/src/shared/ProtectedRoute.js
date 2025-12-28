import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useUser()
  const token = localStorage.getItem('authToken')
  const location = useLocation()

  if (user === undefined) {
    return null
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
