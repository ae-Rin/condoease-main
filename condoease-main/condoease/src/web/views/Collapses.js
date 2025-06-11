import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormTextarea,
  CButton,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Collapses = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [appliedTypeFilter, setAppliedTypeFilter] = useState('')
  const [appliedCategoryFilter, setAppliedCategoryFilter] = useState('')
  const [sortedAsc, setSortedAsc] = useState(true)

  const maintenanceRequests = [
    {
      id: 1,
      tenantName: 'John Doe',
      type: 'Repairs & Fixes',
      category: 'HVAC Repairs',
      description: 'Air conditioning not working properly',
      time: '09:30 AM',
    },
    {
      id: 2,
      tenantName: 'Jane Smith',
      type: 'Cleaning',
      category: 'Window Cleaning',
      description: 'Windows need thorough cleaning',
      time: '10:45 AM',
    },
    {
      id: 3,
      tenantName: 'Michael Lee',
      type: 'Electrical',
      category: 'Lighting Issue',
      description: 'Lobby lights are flickering',
      time: '02:15 PM',
    },
  ]

  const filteredRequests = maintenanceRequests
    .filter(
      (request) =>
        request.type.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (appliedTypeFilter ? request.type === appliedTypeFilter : true) &&
        (appliedCategoryFilter ? request.category === appliedCategoryFilter : true),
    )
    .sort((a, b) => {
      return sortedAsc ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
    })

  const uniqueTypes = [...new Set(maintenanceRequests.map((req) => req.type))]
  const uniqueCategories = [...new Set(maintenanceRequests.map((req) => req.category))]

  const handleSortClick = () => {
    setAppliedTypeFilter(typeFilter)
    setAppliedCategoryFilter(categoryFilter)
    setSortedAsc(!sortedAsc)
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

      <CRow>
        <CCol md={4}>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Search Request"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>

          <div className="d-flex gap-2 mb-2">
            <CFormSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="" disabled hidden>
                Select Type
              </option>
              {uniqueTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </CFormSelect>

            <CFormSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="" disabled hidden>
                Select Category
              </option>
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </CFormSelect>
          </div>

          <CButton
            style={{ backgroundColor: '#F28D35', fontWeight: 'bold' }}
            className="text-white w-100 mb-3"
            onClick={handleSortClick}
          >
            Apply Filter & Sort
          </CButton>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredRequests.map((request) => (
              <CCard
                key={request.id}
                className={`mb-3 ${selectedRequest?.id === request.id ? 'border-warning' : 'border-success'}`}
                onClick={() => setSelectedRequest(request)}
                style={{ cursor: 'pointer' }}
              >
                <CCardBody>
                  <h6>
                    {request.type} - {request.category}
                  </h6>
                  <p className="text-body-secondary small">{request.time}</p>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </CCol>

        <CCol md={8}>
          {selectedRequest ? (
            <CCard className="mb-4 border-warning">
              <CCardHeader>
                <strong>{selectedRequest.tenantName}</strong>
                <div className="text-body-secondary small">
                  {selectedRequest.type} - {selectedRequest.category}
                </div>
              </CCardHeader>
              <CCardBody>
                <p>
                  <strong>Description:</strong> {selectedRequest.description}
                </p>
                <p>
                  <strong>Images & Videos:</strong>
                </p>
                <div className="d-flex gap-2 mb-3">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="border p-3"
                      style={{ width: '100px', height: '80px' }}
                    ></div>
                  ))}
                </div>

                <CFormSelect className="mb-3">
                  <option>Approve</option>
                  <option>In Progress</option>
                  <option>Rejected</option>
                </CFormSelect>

                <CFormTextarea rows="3" placeholder="Add a comment..." className="mb-3" />

                <div className="d-flex justify-content-end">
                  <CButton color="secondary" className="me-2" style={{ fontWeight: 'bold' }}>
                    Cancel
                  </CButton>
                  <CButton
                    style={{ backgroundColor: '#F28D35', fontWeight: 'bold' }}
                    className="text-white"
                  >
                    Send Decision
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          ) : (
            <p className="text-muted">Select a maintenance request to view details.</p>
          )}
        </CCol>
      </CRow>
    </div>
  )
}

export default Collapses
