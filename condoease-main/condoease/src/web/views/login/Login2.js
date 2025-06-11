import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../../../context/UserContext' // <-- useUser Context

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

const Login2 = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useUser() // <-- Context setter

  const emailFromState = location.state?.email || ''
  const [email, setEmail] = useState(emailFromState)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        console.log('%c[Login2] Login successful!', 'color: green')
        console.log('Token:', data.token)
        console.log('User:', data.user)

        localStorage.setItem('authToken', data.token)
        setUser(data.user)

        alert('Login successful!')
        navigate('/cards', { replace: true })
      } else {
        alert(data.error || 'Invalid email or password.')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Server error. Please try again later.')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Navbar */}
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
          <img
            src="/src/assets/images/logo_white.png"
            alt="CondoEase Logo"
            style={{ height: 64, marginRight: 12 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          <span style={{ color: 'white', fontSize: 20 }}>Don't have an account?</span>
          <CButton
            className="text-white fw-bold px-4"
            style={{ borderRadius: 20, fontSize: 20, backgroundColor: '#F28D35' }}
            onClick={() => navigate('/register')}
          >
            Sign up
          </CButton>
        </div>
      </div>

      {/* Login Form */}
      <CContainer className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        <CRow className="justify-content-center w-100">
          <CCol xs={12} md={7} lg={5} xl={4}>
            <div className="text-center mb-4 mt-5">
              <h2 className="fw-bold mb-2 text-start" style={{ fontSize: 32 }}>
                Login
              </h2>
            </div>
            <CForm onSubmit={handleLogin}>
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

              <div className="mb-2 fw-semibold text-start">Password</div>
              <CInputGroup className="mb-3">
                <CFormInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    borderColor: '#A3C49A',
                    borderRadius: 10,
                    fontSize: 16,
                    padding: '16px 16px',
                  }}
                />
                <CInputGroupText
                  style={{ background: 'transparent', cursor: 'pointer', borderColor: '#A3C49A' }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <FaEye color="#A3C49A" />
                </CInputGroupText>
              </CInputGroup>

              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <input
                    type="checkbox"
                    id="keepLoggedIn"
                    checked={keepLoggedIn}
                    onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                    style={{ marginRight: 8 }}
                  />
                  <label htmlFor="keepLoggedIn" style={{ fontSize: 14 }}>
                    Keep me logged in for 30 days
                  </label>
                </div>
                <button
                  type="button"
                  className="btn p-0"
                  style={{
                    color: '#F28D35',
                    fontWeight: 700,
                    fontSize: 14,
                    background: 'none',
                    border: 'none',
                  }}
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="d-grid mb-2 mt-4">
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
                  Login
                </CButton>
              </div>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login2
