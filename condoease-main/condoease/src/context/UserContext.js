import React, { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const stored = localStorage.getItem('authUser')
    setUser(stored ? JSON.parse(stored) : null)
  }, [])

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user))
      } else {
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to sync user to localStorage:', error)
    }
  }, [user])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}
