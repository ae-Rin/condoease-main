import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useUser()
  const token = localStorage.getItem('authToken')
  const location = useLocation()

  console.log('%c[ProtectedRoute]', 'color: orange; font-weight: bold')
  console.log('user =', user)
  console.log('authToken =', token)
  console.log('location.pathname =', location.pathname)

  if (user === undefined) {
    console.log('%cUser still loading, show nothing', 'color: gray')
    return null
  }

  if (!user || !token) {
    console.warn('Redirecting to /login...')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log('%cAccess granted, rendering children', 'color: green')
  return children
}

export default ProtectedRoute
