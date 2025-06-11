import React from 'react'
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'

const Colors = () => {
  const navigate = useNavigate() // Initialize useNavigate

  const handleBalanceClick = () => {
    navigate('/colors') // Navigate to the Balance UI (current page)
  }

  const handleDuesClick = () => {
    navigate('/typography') // Navigate to the Dues UI in Typography.js
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
          <CNavLink active onClick={handleBalanceClick} style={{ cursor: 'pointer' }}>
            Balance
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink onClick={handleDuesClick} style={{ cursor: 'pointer' }}>
            Dues
          </CNavLink>
        </CNavItem>
      </CNav>

      {/* Balance Section */}
      <CCard className="mb-4 border-success">
        <CCardBody>
          <CCardTitle>Balance as of MM/DD/YYYY</CCardTitle>
          <h3 className="text-danger">-123,456.78</h3>
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
                <div>Receipt</div>
              </div>
              <div className="text-danger">-12,345.67</div>
            </div>
          </CCol>
          <CCol xs={12}>
            <div className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <div className="text-body-secondary">HH:MM TT</div>
                <div>Receipt</div>
              </div>
              <div className="text-danger">-12,345.67</div>
            </div>
          </CCol>
          <CCol xs={12}>
            <div className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <div className="text-body-secondary">HH:MM TT</div>
                <div>Check</div>
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
                <div>Receipt</div>
              </div>
              <div className="text-danger">-12,345.67</div>
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

export default Colors
