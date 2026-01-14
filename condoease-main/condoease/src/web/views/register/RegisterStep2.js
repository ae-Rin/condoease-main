import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  CButton,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { FaEye } from 'react-icons/fa'
import logoWhite from 'src/assets/images/logo_white.png'

const RegisterStep2 = () => {
  const API_URL = import.meta.env.VITE_APP_API_URL
  const location = useLocation()
  const navigate = useNavigate()

  const emailFromState = location.state?.email || ''
  const [email, setEmail] = useState(emailFromState)
  const roleFromState = location.state?.role || 'tenant'
  const [role, setRole] = useState(roleFromState)
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rePassword: '',
    role: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{8,}$/

    if (formValues.password !== formValues.rePassword) {
      alert('Passwords do not match!')
      return
    }

    if (!passwordRegex.test(formValues.password)) {
      alert(
        'Password must be at least 8 characters and include a combination of letters, numbers, and special characters (!$@%).',
      )
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/registerstep2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: email,
          password: formValues.password,
          role: role,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        alert('Registration successful!')
        navigate('/login')
      } else {
        alert(data.error || 'Registration failed.')
      }
    } catch (err) {
      alert('Server error. Please try again later.')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Top nav bar */}
      <div
        style={{
          background: '#1D2B57',
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 50px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoWhite} alt="CondoEase Logo" style={{ height: 64, marginRight: 12 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          <span style={{ color: 'white', fontSize: 20 }}>Already have an account?</span>
          <CButton
            className="text-white fw-bold px-4"
            style={{ borderRadius: 20, fontSize: 20, backgroundColor: '#F28D35' }}
            onClick={() => navigate('/login')}
          >
            Log in
          </CButton>
        </div>
      </div>

      {/* Main content */}
      <CContainer className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        <CRow className="justify-content-center w-100">
          <CCol xs={12} md={7} lg={5} xl={4}>
            {/* Progress bar */}
            <div
              className="d-flex justify-content-center align-items-center mb-5 mt-3"
              style={{ gap: 0 }}
            >
              <div
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  background: '#F7941D',
                  border: '3px solid #B86C29',
                }}
              />
              <div style={{ flex: 1, height: 2, background: '#B86C29' }} />
              <div
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  background: '#F7941D',
                  border: '3px solid #B86C29',
                }}
              />
              <div style={{ flex: 1, height: 2, background: '#333333' }} />
              <div
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  background: '#6B6B6B',
                  border: '3px solid #333333',
                }}
              />
            </div>
            {/* Title */}
            <div className="text-center mb-3">
              <h2 className="fw-bold mb-4 text-start" style={{ fontSize: 32 }}>
                Create {role} Account
              </h2>
            </div>
            {/* Form */}
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol>
                  <div className="fw-semibold text-start mb-1">First Name</div>
                  <CFormInput
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleInputChange}
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '16px 16px',
                    }}
                  />
                </CCol>
                <CCol>
                  <div className="fw-semibold text-start mb-1">Last Name</div>
                  <CFormInput
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleInputChange}
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '16px 16px',
                    }}
                  />
                </CCol>
              </CRow>
              <div className="mb-2 fw-semibold text-start">Email</div>
              <CFormInput
                type="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3"
                required
                style={{
                  borderColor: '#A3C49A',
                  borderRadius: 10,
                  fontSize: 16,
                  padding: '16px 16px',
                }}
              />
              <div className="mb-2 fw-semibold text-start">Enter Password</div>
              <CInputGroup className="mb-3">
                <CFormInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  style={{
                    borderColor: '#A3C49A',
                    borderRadius: 10,
                    fontSize: 16,
                    padding: '16px 16px',
                  }}
                />
                <CInputGroupText
                  style={{ background: 'transparent', cursor: 'pointer', borderColor: '#A3C49A' }}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <FaEye color="#A3C49A" />
                </CInputGroupText>
              </CInputGroup>
              <div className="mb-2 fw-semibold text-start">Re-Enter Password</div>
              <CInputGroup className="mb-4">
                <CFormInput
                  type={showRePassword ? 'text' : 'password'}
                  placeholder="Re-Enter Password"
                  name="rePassword"
                  value={formValues.rePassword}
                  onChange={handleInputChange}
                  style={{
                    borderColor: '#A3C49A',
                    borderRadius: 10,
                    fontSize: 16,
                    padding: '16px 16px',
                  }}
                />
                <CInputGroupText
                  style={{ background: 'transparent', cursor: 'pointer', borderColor: '#A3C49A' }}
                  onClick={() => setShowRePassword((v) => !v)}
                >
                  <FaEye color="#A3C49A" />
                </CInputGroupText>
                <small className="text-muted mt-3 text-center">
                  Password must be at least 8 characters and include letters, numbers, and special
                  characters (!$@%).
                </small>
              </CInputGroup>
              <div className="d-grid mb-4">
                <CButton
                  className="text-white fw-bold"
                  style={{
                    borderRadius: 50,
                    fontSize: 25,
                    padding: '13px 0',
                    width: '90%',
                    margin: '0 auto',
                    backgroundColor: '#F28D35',
                  }}
                  type="submit"
                >
                  Create Account
                </CButton>
              </div>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default RegisterStep2
