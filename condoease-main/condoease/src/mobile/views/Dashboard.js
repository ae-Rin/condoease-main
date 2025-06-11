import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'
import io from 'socket.io-client'
import axios from 'axios'
const socket = io('http://localhost:5000') // 👈 Adjust if server is remote

const Dashboard = () => {
  const navigate = useNavigate() // Initialize useNavigate
  const [announcements, setAnnouncements] = useState([])

  const handleBalanceClick = () => {
    navigate('/colors') // Navigates to the Colors.js route
  }

  const handleDuesClick = () => {
    navigate('/typography') // Navigate to Typography.js
  }

  const handleRequestMaintenanceClick = () => {
    navigate('/charts') // Navigate to Charts.js (Maintenance Info UI)
  }

  // Listen for real-time updates
  useEffect(() => {
    socket.on('new_announcement', (newAnn) => {
      setAnnouncements((prev) => [newAnn, ...prev])
    })

    socket.on('announcement_updated', (updated) => {
      setAnnouncements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    })

    socket.on('announcement_deleted', ({ id }) => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    })

    return () => {
      socket.off('new_announcement')
      socket.off('announcement_updated')
      socket.off('announcement_deleted')
    }
  }, [])

  return (
    <div>
      <h2 className="mb-4">Welcome, [Tenant User]!</h2>

      {/* Announcements Section */}
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Announcements</h5>
        </div>

        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <CCard className="mb-3 border-success" key={a.id}>
              <CCardBody>
                <CCardTitle>{a.title}</CCardTitle>
                <CCardText>{a.description}</CCardText>
                {a.file_url && (
                  <a href={`http://localhost:5000${a.file_url}`} target="_blank" rel="noreferrer">
                    View Attachment
                  </a>
                )}
              </CCardBody>
            </CCard>
          ))
        )}
      </section>

      {/* Payment and Billing Section */}
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Payment and Billing</h5>
        </div>
        <CRow>
          <CCol xs={6}>
            <CCard className="mb-3 border-success">
              <CCardBody onClick={handleBalanceClick} style={{ cursor: 'pointer' }}>
                <CCardTitle>Balance</CCardTitle>
                <CCardText>as of MM/DD/YYYY</CCardText>
                <h3 className="text-danger">-123,456.78</h3>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={6}>
            <CCard className="mb-3 border-success">
              <CCardBody onClick={handleDuesClick} style={{ cursor: 'pointer' }}>
                <CCardTitle>Dues</CCardTitle>
                <CCardText>as of MM/DD/YYYY</CCardText>
                <h3 className="text-success">6,543.21</h3>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </section>

      {/* Maintenance Information Section */}
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Maintenance Information</h5>
        </div>
        <CRow>
          <CCol xs={6}>
            <CCard className="mb-3 border-success">
              <CCardBody onClick={handleRequestMaintenanceClick} style={{ cursor: 'pointer' }}>
                <CCardTitle>Request Maintenance</CCardTitle>
                <CCardText>Submit a maintenance request form</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={6}>
            <CCard className="mb-3 border-success">
              <CCardBody>
                <CCardTitle>Maintenance Status</CCardTitle>
                <CCardText>No ongoing maintenance request</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </section>

      {/* Unit Information Section */}
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Unit Information</h5>
        </div>
        <CRow>
          <CCol xs={6}>
            <CCard className="mb-3 border-success">
              <CCardBody>
                <CCardTitle>Tenant Details</CCardTitle>
                <CCardText>ID, Documents</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={6}>
            <CCard className="mb-3 border-success">
              <CCardBody>
                <CCardTitle>Lease & Unit Details</CCardTitle>
                <CCardText>Lease Type, Start & End Date, Amenities</CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </section>
    </div>
  )
}

export default Dashboard
