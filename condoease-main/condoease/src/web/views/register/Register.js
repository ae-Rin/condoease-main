import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CButton, CContainer, CForm, CFormInput, CRow, CCol, CFormSelect } from '@coreui/react'
import logoWhite from 'src/assets/images/logo_white.png'

const Register = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [role, setRole] = useState('')

  const handleContinue = (e) => {
    e.preventDefault()
    navigate('/registerstep2', { state: { email, role } })
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
                <div className="mb-2 fw-semibold text-start">Role</div>
                <CFormSelect
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    borderColor: '#A3C49A',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '16px',
                  }}
                >
                  <option style={{ fontWeight: 'bold' }} value="">
                    Select Role
                  </option>
                  <option value="tenant">Tenant</option>
                  <option value="owner">Owner</option>
                </CFormSelect>
                <div className="d-grid mb-4"></div>
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
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
