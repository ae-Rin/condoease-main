/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoWhite from 'src/assets/images/logo_white.png'
import { CButton, CContainer, CForm, CFormInput, CRow, CCol } from '@coreui/react'

const RegisterVerify = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email
  const [confirmationCode, setConfirmationCode] = useState('')
  const API_URL = import.meta.env.VITE_APP_API_URL


  const handleResendCode = async () => {
    try {
      const res = await fetch(`${API_URL}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        alert('Confirmation code resent to your email.')
      } else {
        alert(data.detail || 'Failed to resend code')
      }
    } catch {
      alert('Server error')
    }
  }

  const handleVerifyEmail = async (e) => {
    e.preventDefault()

    if (!confirmationCode) {
      alert('Please enter the confirmation code.')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: confirmationCode,
        }),
      })
      const data = await res.json()
      if (data.success) {
        alert('Email verified successfully! Waiting for Admin Approval.')
        navigate('/login')
      } else {
        alert(data.error || 'Verification failed')
      }
    } catch (err) {
      alert('Server error')
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
          <img
            src={logoWhite}
            alt="CondoEase Logo"
            style={{ height: 64, marginRight: 12 }}
          />
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
              <div style={{ flex: 1, height: 3, background: '#B86C29' }} />
              <div
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  background: '#F7941D',
                  border: '3px solid #B86C29',
                }}
              />
              <div style={{ flex: 1, height: 3, background: '#B86C29' }} />
              <div
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  background: '#F7941D',
                  border: '3px solid #B86C29',
                }}
              />
            </div>
            {/* Title */}
            <div className="text-center mb-3">
              <h2 className="fw-bold mb-4 text-start" style={{ fontSize: 32 }}>
                Verify your email
              </h2>
              <p className="text-start" style={{ fontSize: 16 }}>
                An email has been sent to <strong>{email}</strong> with a confirmation code.
              </p>
            </div>
            {/* Form */}
            <CForm onSubmit={handleVerifyEmail}>
              <div className="mb-2 fw-semibold text-start">Confirmation Code</div>
              <CFormInput
                type="text"
                placeholder="Enter confirmation code"
                name="confirmationCode"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                style={{
                  borderColor: '#A3C49A',
                  borderRadius: 10,
                  fontSize: 16,
                  padding: '16px 16px',
                }}
              />
              <div className="d-grid mt-4 mb-3">
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
                  Verify Email
                </CButton>
              </div>
              <div className="text-center">
                <CButton
                  className="text-orange fw-bold"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: 16,
                    color: '#F28D35',
                  }}
                  onClick={handleResendCode}
                >
                  Resend Code
                </CButton>
              </div>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default RegisterVerify
