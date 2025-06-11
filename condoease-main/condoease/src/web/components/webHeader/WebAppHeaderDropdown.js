import React, { useEffect } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
  CDropdownDivider,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout, cilSettings } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../context/UserContext' // Corrected import path for useUser
import defaultAvatar from '../../../assets/images/avatars/8.jpg' // Corrected path for defaultAvatar

const WebAppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { user, setUser } = useUser() // Access user and setUser from context

  // Determine the avatar URL
  const avatar = user?.avatar?.startsWith('/uploads/')
    ? `http://localhost:5000${user.avatar}`
    : defaultAvatar

  // Sync user state with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('authUser'))
      if (updatedUser) {
        setUser(updatedUser)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [setUser])

  // User details
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Property Manager'
  const email = user?.email || 'PropertyManager@email.com'

  // Logout handler
  const handleLogout = () => {
    setUser(null) // Clear user state
    localStorage.removeItem('authToken') // Remove auth token
    navigate('/login') // Redirect to login page
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar} size="md" onError={(e) => (e.target.src = defaultAvatar)} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end" style={{ width: '250px' }}>
        <div className="text-center p-3 border-bottom">
          <CAvatar
            src={avatar}
            size="xl"
            className="mb-2"
            onError={(e) => (e.target.src = defaultAvatar)}
          />
          <div className="fw-semibold">{fullName}</div>
          <div className="text-muted small">{email}</div>
        </div>
        <CDropdownItem onClick={() => navigate('/navs')}>
          <CIcon icon={cilSettings} className="me-2" />
          Account Settings
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default WebAppHeaderDropdown
