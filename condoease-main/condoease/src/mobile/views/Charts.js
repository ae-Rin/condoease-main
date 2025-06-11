import React from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'

const TenantMaintenance = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h5>Maintenance Information</h5>
        <CButton color="link" className="text-decoration-none">
          <i className="cil-arrow-left"></i>
        </CButton>
      </header>

      {/* Maintenance Status Section */}
      <section className="mb-4">
        <h6>Maintenance Status</h6>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>3 Ongoing maintenance request</span>
            <i className="cil-chevron-right"></i>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>2 Pending maintenance request</span>
            <i className="cil-chevron-right"></i>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Cancelled maintenance request</span>
            <i className="cil-chevron-right"></i>
          </CCardBody>
        </CCard>
      </section>

      {/* Request Maintenance Section */}
      <section className="mb-4">
        <h6>Request Maintenance</h6>
        <CForm>
          <div className="mb-3">
            <CFormLabel>Type of Maintenance:</CFormLabel>
            <CFormSelect>
              <option>Emergency Maintenance</option>
              <option>Regular Maintenance</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel>Category:</CFormLabel>
            <CFormSelect>
              <option>Water Leaks / Flooding</option>
              <option>Electrical Issues</option>
              <option>Structural Damage</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel>Description:</CFormLabel>
            <CFormTextarea rows="3" placeholder="Enter a detailed description of the issue">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </CFormTextarea>
          </div>
          <div className="mb-3">
            <CFormLabel>Image / Video Attachment:</CFormLabel>
            <CButton color="warning" className="text-white">
              Choose File
            </CButton>
            <div className="mt-2 text-center">
              <i className="cil-file" style={{ fontSize: '2rem' }}></i>
              <p className="text-body-secondary">No attached files</p>
            </div>
          </div>
          <CButton color="warning" className="text-white w-100">
            Proceed
          </CButton>
        </CForm>
      </section>
    </div>
  )
}

export default TenantMaintenance
