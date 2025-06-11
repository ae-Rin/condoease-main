import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CButton, CContainer, CForm, CFormInput, CRow, CCol } from '@coreui/react'
import { FaGoogle, FaFacebookF } from 'react-icons/fa'

const Register = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleContinue = (e) => {
    e.preventDefault()
    navigate('/registerstep2', { state: { email } })
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
            src="/src/assets/images/logo_white.png"
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
                Create Account
              </h2>
            </div>
            {/* Email form */}
            <CForm onSubmit={handleContinue}>
              <div className="mb-2 fw-semibold text-start">Email</div>
              <CFormInput
                type="email"
                placeholder="email@gmail.com"
                className="mb-4"
                style={{
                  borderColor: '#A3C49A',
                  borderRadius: 10,
                  fontSize: 16,
                  padding: '16px 16px',
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
                  Continue with Email
                </CButton>
              </div>
              {/* Divider */}
              <div className="d-flex align-items-center mb-4">
                <div style={{ flex: 1, height: 1, background: '#A3C49A' }} />
                <span className="mx-2 text-body-secondary">Or</span>
                <div style={{ flex: 1, height: 1, background: '#A3C49A' }} />
              </div>
              {/* Social buttons */}
              <div className="d-grid mb-2">
                <CButton
                  variant="outline"
                  color="light"
                  className="fw-semibold mb-3"
                  style={{
                    borderColor: '#A3C49A',
                    borderRadius: 15,
                    fontSize: 18,
                    color: '#222',
                    padding: '16px 0',
                  }}
                >
                  <FaGoogle style={{ marginRight: 8 }} />
                  Continue with Google
                </CButton>
                <CButton
                  variant="outline"
                  color="light"
                  className="fw-semibold"
                  style={{
                    borderColor: '#A3C49A',
                    borderRadius: 15,
                    fontSize: 18,
                    color: '#222',
                    padding: '16px 0',
                  }}
                >
                  <FaFacebookF style={{ marginRight: 8 }} />
                  Continue with Facebook
                </CButton>
              </div>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
