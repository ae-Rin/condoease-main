import React from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CRow,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'

const TenantDues = () => {
  const navigate = useNavigate() // Initialize useNavigate

  const handleBalanceClick = () => {
    navigate('/colors') // Navigate to the Balance UI in Colors.js
  }

  const handleDuesClick = () => {
    navigate('/typography') // Navigate to the Dues UI (current page)
  }

  return (
    <div>
      {/* Header Section */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h5>Payment and Billing</h5>
        <CButton color="link" className="text-decoration-none">
          <i className="cil-reload"></i>
        </CButton>
      </header>

      {/* Tabs Section */}
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink onClick={handleBalanceClick} style={{ cursor: 'pointer' }}>
            Balance
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active onClick={handleDuesClick} style={{ cursor: 'pointer' }}>
            Dues
          </CNavLink>
        </CNavItem>
      </CNav>

      {/* Dues Section */}
      <CCard className="mb-4 border-danger">
        <CCardBody>
          <CCardTitle>Dues as of MM/DD/YYYY</CCardTitle>
          <h3 className="text-danger">6,543.21</h3>
        </CCardBody>
      </CCard>

      {/* Transaction History Section */}
      <section className="mb-4">
        <h6 className="text-body-secondary">MM DD, YYYY</h6>
        <CRow>
          <CCol xs={12}>
            <div className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <div className="text-body-secondary">HH:MM TT</div>
                <div>Parking</div>
              </div>
              <div className="text-danger">-1,234.56</div>
            </div>
          </CCol>
          <CCol xs={12}>
            <div className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <div className="text-body-secondary">HH:MM TT</div>
                <div>Gym</div>
              </div>
              <div className="text-danger">-1,234.56</div>
            </div>
          </CCol>
          <CCol xs={12}>
            <div className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <div className="text-body-secondary">HH:MM TT</div>
                <div>Payment</div>
              </div>
              <div className="text-success">+12,345.67</div>
            </div>
          </CCol>
        </CRow>
      </section>

      <section className="mb-4">
        <h6 className="text-body-secondary">MM DD, YYYY</h6>
        <CRow>
          <CCol xs={12}>
            <div className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <div className="text-body-secondary">HH:MM TT</div>
                <div>Parking</div>
              </div>
              <div className="text-danger">-1,234.56</div>
            </div>
          </CCol>
          <CCol xs={12}>
            <div className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <div className="text-body-secondary">HH:MM TT</div>
                <div>Gym</div>
              </div>
              <div className="text-danger">-1,234.56</div>
            </div>
          </CCol>
          <CCol xs={12}>
            <div className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <div className="text-body-secondary">HH:MM TT</div>
                <div>Pool</div>
              </div>
              <div className="text-danger">-1,234.56</div>
            </div>
          </CCol>
        </CRow>
      </section>

      {/* Request Transaction History Section */}
      <div className="text-center mb-4">
        <p className="text-body-secondary">Submit a request to view more transaction history.</p>
        <CButton color="warning" className="text-white w-100">
          Request transaction history
        </CButton>
      </div>
    </div>
  )
}

export default TenantDues
