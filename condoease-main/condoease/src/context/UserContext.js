import React, { createContext, use, useContext, useEffect, useState } from 'react'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  //const [user, setUser] = useState(undefined) // undefined = loading, null = not logged in
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const stored = localStorage.getItem('authUser')
  //   console.log('%c[UserContext]', 'color: blue; font-weight: bold')
  //   console.log('Loaded from localStorage:', stored)
  //   try {
  //     setUser(stored ? JSON.parse(stored) : null)
  //   } catch (e) {
  //     console.error('Parse error:', e)
  //     setUser(null)
  //   }
  // }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('authToken')
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
  }
  // useEffect(() => {
  //   try {
  //     if (user) {
  //       localStorage.setItem('authUser', JSON.stringify(user))
  //     } else {
  //       localStorage.removeItem('authUser')
  //     }
  //   } catch (error) {
  //     console.error('Failed to sync user to localStorage:', error)
  //   }
  // }, [user])

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  )
}
export const useUser = () => useContext(UserContext)
// export const useUser = () => {
//   const context = useContext(UserContext)
//   if (!context) throw new Error('useUser must be used within a UserProvider')
//   return context
// }
