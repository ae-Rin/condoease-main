import React from 'react'
import { CCard, CCardBody, CCardTitle, CButton } from '@coreui/react'

const UnitInformation = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h5>Unit Information</h5>
        <CButton color="link" className="text-decoration-none">
          <i className="cil-arrow-left"></i>
        </CButton>
      </header>

      {/* Tenant Details Section */}
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h6>Tenant Details</h6>
          <a href="#" className="text-decoration-none text-warning">
            Edit Profile
          </a>
        </div>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Name</span>
            <span>Jose R. Dela Cruz</span>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Date of Birth</span>
            <span>MM/DD/YYYY</span>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Contact Details</span>
            <span>0912 345 6789</span>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Tenant ID</span>
            <span>Pending</span>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Emergency Contact</span>
            <span>Maria R. Dela Cruz</span>
          </CCardBody>
        </CCard>
      </section>

      {/* Lease & Unit Details Section */}
      <section className="mb-4">
        <h6>Lease & Unit Details</h6>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Unit Number</span>
            <span>1234</span>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Unit Type</span>
            <span>Standard Room</span>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Lease Start Date</span>
            <span>MM/DD/YYYY</span>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Lease End Date</span>
            <span>MM/DD/YYYY</span>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <span>Payment Method</span>
            <span>PDC</span>
          </CCardBody>
        </CCard>
      </section>

      {/* Footer Note */}
      <div className="text-center mb-4">
        <p className="text-body-secondary">Contact your Property Manager for changes.</p>
      </div>
    </div>
  )
}

export default UnitInformation
