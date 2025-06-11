import React, { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined) // undefined = loading, null = not logged in

  useEffect(() => {
    const stored = localStorage.getItem('authUser')
    console.log('%c[UserContext]', 'color: blue; font-weight: bold')
    console.log('Loaded from localStorage:', stored)
    try {
      setUser(stored ? JSON.parse(stored) : null)
    } catch (e) {
      console.error('Parse error:', e)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user))
      } else {
        localStorage.removeItem('authUser')
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
