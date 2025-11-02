/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Collapses = () => {
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [maintenanceRequests, setMaintenanceRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    ongoing: 0,
    completed: 0,
  })

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const res = await fetch(`${API_URL}/api/maintenance-requests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch maintenance requests')
        }

        const data = await res.json()
        setMaintenanceRequests(data.requests)

        // Calculate stats
        const total = data.requests.length
        const pending = data.requests.filter((req) => req.status === 'pending').length
        const ongoing = data.requests.filter((req) => req.status === 'ongoing').length
        const completed = data.requests.filter((req) => req.status === 'completed').length

        setStats({ total, pending, ongoing, completed })
      } catch (err) {
        console.error('Error fetching maintenance requests:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMaintenanceRequests()
  }, [API_URL])

  const handleViewRequest = (requestId) => {
    navigate(`/maintenance-request/${requestId}`)
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Maintenance Tracking</h4>
      <div className="mb-3">
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/cards')}
        >
          DASHBOARD
        </span>{' '}
        / <span style={{ color: '#F28D35' }}>MAINTENANCE TRACKING</span>
      </div>

      {/* Stats Cards */}
      <CRow className="mb-4">
        <CCol md={3}>
          <CCard className="border-primary">
            <CCardBody>
              <h6>Total Requests</h6>
              <h4>{stats.total}</h4>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-warning">
            <CCardBody>
              <h6>Pending Requests</h6>
              <h4>{stats.pending}</h4>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-info">
            <CCardBody>
              <h6>Ongoing Requests</h6>
              <h4>{stats.ongoing}</h4>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-success">
            <CCardBody>
              <h6>Completed Requests</h6>
              <h4>{stats.completed}</h4>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Maintenance Requests Table */}
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Request ID</CTableHeaderCell>
            <CTableHeaderCell>Tenant Fullname</CTableHeaderCell>
            <CTableHeaderCell>Maintenance Type</CTableHeaderCell>
            <CTableHeaderCell>Category</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Date Created</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center">
                Loading maintenance requests...
              </CTableDataCell>
            </CTableRow>
          ) : maintenanceRequests.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="7" cclassName="text-center">
                No maintenance requests found.
              </CTableDataCell>
            </CTableRow>
          ) : (
            maintenanceRequests.map((request) => (
              <CTableRow key={request.maintenance_request_id}>
                <CTableDataCell>{request.maintenance_request_id}</CTableDataCell>
                <CTableDataCell>
                  {request.first_name} {request.last_name}
                </CTableDataCell>
                <CTableDataCell>{request.maintenance_type}</CTableDataCell>
                <CTableDataCell>{request.category}</CTableDataCell>
                <CTableDataCell>{request.status}</CTableDataCell>
                <CTableDataCell>{new Date(request.created_at).toLocaleDateString()}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewRequest(request.maintenance_request_id)}
                  >
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default Collapses
