import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
} from '@coreui/react'
import { useUser } from '../../context/UserContext'
import defaultAvatar from '../../../src/assets/images/avatars/8.jpg'

const EditModal = ({ visible, field, tempData, setTempData, onClose, onSave }) => {
  const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Edit {fieldLabel}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {field === 'name' && (
          <>
            <label>First Name</label>
            <CFormInput
              className="mb-2"
              value={tempData.firstName || ''}
              onChange={(e) => setTempData({ ...tempData, firstName: e.target.value })}
            />
            <label>Last Name</label>
            <CFormInput
              value={tempData.lastName || ''}
              onChange={(e) => setTempData({ ...tempData, lastName: e.target.value })}
            />
          </>
        )}
        {field === 'email' && (
          <>
            <label>Email</label>
            <CFormInput
              className="mb-2"
              value={tempData.email || ''}
              onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
            />
            <label>Password (for verification)</label>
            <CFormInput
              type="password"
              value={tempData.password || ''}
              onChange={(e) => setTempData({ ...tempData, password: e.target.value })}
            />
          </>
        )}
        {field === 'password' && (
          <>
            <label>Current Password</label>
            <div className="d-flex mb-2">
              <CFormInput
                type={showCurrent ? 'text' : 'password'}
                value={tempData.current || ''}
                onChange={(e) => setTempData({ ...tempData, current: e.target.value })}
              />
              <CButton
                style={{ fontWeight: 'bold' }}
                color="secondary"
                size="sm"
                className="ms-2"
                onClick={() => setShowCurrent((prev) => !prev)}
              >
                {showCurrent ? 'Hide' : 'Show'}
              </CButton>
            </div>

            <label>New Password</label>
            <div className="d-flex mb-2">
              <CFormInput
                type={showNew ? 'text' : 'password'}
                value={tempData.new || ''}
                onChange={(e) => setTempData({ ...tempData, new: e.target.value })}
              />
              <CButton
                style={{ fontWeight: 'bold' }}
                color="secondary"
                size="sm"
                className="ms-2"
                onClick={() => setShowNew((prev) => !prev)}
              >
                {showNew ? 'Hide' : 'Show'}
              </CButton>
            </div>

            <label>Re-type New Password</label>
            <div className="d-flex">
              <CFormInput
                type={showConfirm ? 'text' : 'password'}
                value={tempData.confirm || ''}
                onChange={(e) => setTempData({ ...tempData, confirm: e.target.value })}
              />
              <CButton
                style={{ fontWeight: 'bold' }}
                color="secondary"
                size="sm"
                className="ms-2"
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </CButton>
            </div>
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton style={{ fontWeight: 'bold' }} color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton
          style={{ backgroundColor: '#F28D35', fontWeight: 'bold', color: 'white' }}
          onClick={onSave}
        >
          Save Changes
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

const ArchiveModal = ({ visible, onClose, onConfirm }) => (
  <CModal visible={visible} onClose={onClose}>
    <CModalHeader>
      <CModalTitle>Confirm Account Archival</CModalTitle>
    </CModalHeader>
    <CModalBody>
      Are you sure you want to archive your account? This action cannot be undone.
    </CModalBody>
    <CModalFooter>
      <CButton style={{ fontWeight: 'bold' }} color="secondary" onClick={onClose}>
        Cancel
      </CButton>
      <CButton style={{ fontWeight: 'bold', color: 'white' }} color="danger" onClick={onConfirm}>
        Archive Account
      </CButton>
    </CModalFooter>
  </CModal>
)

const Navs = () => {
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const { user, setUser } = useUser()
  const API_URL = import.meta.env.VITE_APP_API_URL

  // const avatar = user?.avatar?.startsWith('/uploads/')
  //   ? `http://localhost:5000${user.avatar}`
  //   : defaultAvatar

  const avatar = user?.avatar?.startsWith('/uploads/') ? `${API_URL}${user.avatar}` : defaultAvatar

  const [userData, setUserData] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const [profilePicture, setProfilePicture] = useState(avatar)
  const [archiveModalVisible, setArchiveModalVisible] = useState(false)
  const [currentField, setCurrentField] = useState('')
  const [tempData, setTempData] = useState({})

  useEffect(() => {
    if (user) setUserData(user)
  }, [user])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        const data = await res.json()
        if (res.ok) {
          setUser(data)
          setUserData(data)
        } else {
          console.error('Failed to fetch user:', data)
        }
      } catch (err) {
        console.error('Fetch user error:', err)
      }
    }
    fetchUser()
  }, [API_URL, setUser])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const res = await fetch(`${API_URL}/api/users/avatar`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.avatar) {
        setUser({ ...user, avatar: data.avatar })
        alert('Profile Updated!')
      } else alert('Failed to update avatar.')
    } catch (err) {
      console.error('Avatar upload error:', err)
      alert('Failed to update avatar.')
    }
  }

  const openEditModal = (field) => {
    setCurrentField(field)
    if (field === 'name') setTempData({ firstName: user.firstName, lastName: user.lastName })
    if (field === 'email') setTempData({ email: user.email, password: '' })
    if (field === 'password') setTempData({ current: '', new: '', confirm: '' })
    setModalVisible(true)
  }

  const saveChanges = async () => {
    let updatePayload = {}
    if (currentField === 'name') {
      if (!tempData.firstName || !tempData.lastName)
        return alert('First name and last name are required.')
      updatePayload = { firstName: tempData.firstName, lastName: tempData.lastName }
    } else if (currentField === 'email') {
      if (!tempData.email || !tempData.password)
        return alert('Both email and password are required.')
      updatePayload = { email: tempData.email, password: tempData.password }
    } else if (currentField === 'password') {
      const { current, new: newPass, confirm } = tempData
      if (!current || !newPass || !confirm) return alert('All password fields are required.')
      if (newPass !== confirm) return alert('New password and confirmation do not match.')
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{8,}$/
      if (!passwordRegex.test(newPass))
        return alert(
          'Password must be at least 8 characters and include letters, numbers, and special characters (!$@%).',
        )
      updatePayload = { currentPassword: current, password: newPass }
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(updatePayload),
      })
      const resData = await response.json()
      if (response.ok) {
        setUser({ ...user, ...updatePayload })
        document.activeElement.blur()
        setModalVisible(false)
        alert('Profile updated successfully!')
      } else alert('Error updating account: ' + resData.error)
    } catch (err) {
      console.error('Error updating account:', err)
      alert('Failed to update account.')
    }
  }

  const handleArchiveAccount = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
      const resData = await response.json()
      if (response.ok) {
        localStorage.removeItem('authToken')
        navigate('/login')
      } else alert('Error archiving account: ' + resData.error)
    } catch (err) {
      console.error('Error archiving account:', err)
    }
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Account Settings</h4>
      <div className="mb-3">
        <span
          className="text-body-secondary text-decoration-none"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/cards')}
        >
          DASHBOARD
        </span>
        {' / '}
        <span style={{ color: '#F28D35' }}>ACCOUNT SETTINGS</span>
      </div>

      <CRow className="justify-content-start mb-4">
        <CCol md={10}>
          <CCard className="p-3">
            <CRow className="align-items-center">
              <CCol xs="auto">
                <CAvatar
                  src={avatar}
                  size="xl"
                  alt="Profile"
                  onError={(e) => (e.target.src = defaultAvatar)}
                />
              </CCol>
              <CCol>
                <h5 className="mb-1">
                  {user?.firstName} {user?.lastName}
                </h5>
                <p className="text-muted mb-0">{user?.email}</p>
              </CCol>
              <CCol xs="auto" className="text-end">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <CButton
                  style={{ fontWeight: 'bold', color: 'white', backgroundColor: '#F28D35' }}
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Profile Picture
                </CButton>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="justify-content-start mb-4">
        <CCol md={10}>
          <CCard>
            <CCardHeader className="text-body-secondary">
              <strong>Profile Information</strong>
            </CCardHeader>
            <CCardBody>
              {['name', 'email', 'password'].map((field) => (
                <div
                  key={field}
                  className="text-body-secondary mb-3 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => openEditModal(field)}
                >
                  <div>
                    <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                    <p className="mb-0">
                      {field === 'name'
                        ? `${user?.firstName} ${user?.lastName}`
                        : field === 'email'
                          ? user?.email
                          : '********'}
                    </p>
                  </div>
                  <span style={{ fontSize: '1.5rem', color: '#adb5bd' }}>{'›'}</span>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="justify-content-center mt-3">
        <CCol md={8} className="d-flex justify-content-end">
          <CButton
            style={{ fontWeight: 'bold', color: 'white' }}
            color="danger"
            onClick={() => setArchiveModalVisible(true)}
          >
            Archive Account
          </CButton>
        </CCol>
      </CRow>

      <EditModal
        visible={modalVisible}
        field={currentField}
        tempData={tempData}
        setTempData={setTempData}
        onClose={() => {
          document.activeElement?.blur()
          setModalVisible(false)
        }}
        onSave={saveChanges}
      />
      <ArchiveModal
        visible={archiveModalVisible}
        onClose={() => {
          document.activeElement?.blur()
          setArchiveModalVisible(false)
        }}
        onConfirm={handleArchiveAccount}
      />
    </div>
  )
}

export default Navs
