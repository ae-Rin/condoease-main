import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardTitle, CCardText, CCol, CRow } from '@coreui/react'
import { useUser } from '../../context/UserContext'

const cardStyle = {
  borderRadius: '20px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
}

const Cards = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  if (!user || !user.firstName) {
    return (
      <div className="text-center mt-5">
        <h2>User data not found.</h2>
        <p>Please log in again.</p>
        <button className="btn btn-warning" onClick={() => navigate('/login')}>
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1 className="mb-4" style={{ fontWeight: 'bold' }}>
        Welcome, {user.firstName}!
      </h1>

      {/* Announcements Section */}
      <section className="mb-5">
        <h5 className="mb-3">Announcements</h5>
        <CRow className="gy-4">
          {' '}
          {/* 35px vertical gap */}
          <CCol xs={6}>
            <CCard className="border-success" style={cardStyle}>
              <CCardBody style={{ cursor: 'pointer' }} onClick={() => navigate('/carousel')}>
                <CCardTitle>Send an Announcement</CCardTitle>
                <CCardText>
                  Announcements are key for sharing important updates, decisions, events, or
                  changes. They keep everyone informed and aligned.
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          {Array.isArray(user.announcements) && user.announcements.length > 0 ? (
            user.announcements.map((a, index) => (
              <CCol xs={6} key={index}>
                <CCard className="border-success" style={cardStyle}>
                  <CCardBody>
                    <CCardTitle>{a.title}</CCardTitle>
                    <CCardText>{a.description}</CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
            ))
          ) : (
            <CCol xs={6}>
              <CCard className="border-success" style={cardStyle}>
                <CCardBody style={{ cursor: 'pointer' }} onClick={() => navigate('/carousel')}>
                  <CCardTitle>View Announcements</CCardTitle>
                  <CCardText>No announcements yet.</CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          )}
        </CRow>
      </section>

      {/* Maintenance Section */}
      <section className="mb-5">
        <h5 className="mb-3">Maintenance Information</h5>
        <CRow className="gy-4">
          <CCol xs={6}>
            <CCard className="border-success" style={cardStyle}>
              <CCardBody style={{ cursor: 'pointer' }} onClick={() => navigate('/collapses')}>
                <CCardTitle>View Maintenance Requests</CCardTitle>
                <CCardText>View maintenance request forms</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={6}>
            <CCard className="border-success" style={cardStyle}>
              <CCardBody>
                <CCardTitle>Maintenance Status</CCardTitle>
                <CCardText>10 ongoing maintenance requests</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </section>

      {/* Tenant Transactions Section */}
      <section className="mb-5">
        <h5 className="mb-3">Tenant Transactions</h5>
        <CRow className="gy-4">
          <CCol xs={6}>
            <CCard className="border-success" style={cardStyle}>
              <CCardBody style={{ cursor: 'pointer' }} onClick={() => navigate('/listgroups')}>
                <CCardTitle>View Tenants</CCardTitle>
                <CCardText>View Tenant Details</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </section>

      {/* Unit Management Section */}
      <section className="mb-5">
        <h5 className="mb-3">Unit Management</h5>
        <CRow className="gy-4">
          <CCol xs={6}>
            <CCard className="border-success" style={cardStyle}>
              <CCardBody style={{ cursor: 'pointer' }} onClick={() => navigate('/tables')}>
                <CCardTitle>View Units</CCardTitle>
                <CCardText>View Current Units</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </section>
    </div>
  )
}

export default Cards
