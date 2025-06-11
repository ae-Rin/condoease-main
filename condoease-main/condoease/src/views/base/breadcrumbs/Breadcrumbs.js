import React from 'react'
import { CCard, CCardBody, CButton } from '@coreui/react'

const TenantMessages = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h5>Messages</h5>
        <CButton color="link" className="text-decoration-none">
          <i className="cil-layers"></i>
        </CButton>
      </header>

      {/* Messages List */}
      <section className="mb-4">
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-warning text-white d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px' }}
              >
                <span>P</span>
              </div>
              <div className="ms-3">
                <div>Property Manager Name</div>
                <div className="text-body-secondary">Lorem ipsum dolor sit amet, co...</div>
              </div>
            </div>
            <div className="text-end">
              <div className="text-body-secondary">HH:MM TT</div>
              <i className="cil-chevron-right"></i>
            </div>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-warning text-white d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px' }}
              >
                <span>P</span>
              </div>
              <div className="ms-3">
                <div>Property Manager Name</div>
                <div className="text-body-secondary">Lorem ipsum dolor sit amet, co...</div>
              </div>
            </div>
            <div className="text-end">
              <div className="text-body-secondary">HH:MM TT</div>
              <i className="cil-chevron-right"></i>
            </div>
          </CCardBody>
        </CCard>
        <CCard className="mb-2 border-success">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-warning text-white d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px' }}
              >
                <span>P</span>
              </div>
              <div className="ms-3">
                <div>Property Manager Name</div>
                <div className="text-body-secondary">Lorem ipsum dolor sit amet, co...</div>
              </div>
            </div>
            <div className="text-end">
              <div className="text-body-secondary">HH:MM TT</div>
              <i className="cil-chevron-right"></i>
            </div>
          </CCardBody>
        </CCard>
      </section>
    </div>
  )
}

export default TenantMessages
