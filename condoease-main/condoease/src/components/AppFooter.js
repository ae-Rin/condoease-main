import React from 'react'
import { CFooter, CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom' // Import useNavigate

const AppFooter = () => {
  const navigate = useNavigate() // Initialize useNavigate

  // Navigation functions for each button
  const handleHomeClick = () => {
    navigate('/dashboard') // Navigate to Dashboard.js
  }

  const handlePaymentClick = () => {
    navigate('/colors') // Navigate to Balance (Colors.js)
  }

  const handleSettingsClick = () => {
    navigate('/charts') // Navigate to Maintenance Info (Charts.js)
  }

  const handleMessagesClick = () => {
    navigate('/base/breadcrumbs') // Navigate to Messages (Breadcrumb.js)
  }

  return (
    <div className="position-fixed bottom-0 start-0 end-0 bg-custom">
      <CFooter className="d-flex justify-content-around text-white py-3">
        <CButton color="link" className="text-white" onClick={handleHomeClick}>
          <img src="/src/assets/images/cil-home.svg" alt="Home" width="24" height="24" />
        </CButton>
        <CButton color="link" className="text-white" onClick={handlePaymentClick}>
          <img src="/src/assets/images/cil-credit-card.svg" alt="Payment" width="24" height="24" />
        </CButton>
        <CButton color="link" className="text-white" onClick={handleSettingsClick}>
          <img src="/src/assets/images/cil-settings.svg" alt="Settings" width="24" height="24" />
        </CButton>
        <CButton color="link" className="text-white" onClick={handleMessagesClick}>
          <img src="/src/assets/images/cil-speech.svg" alt="Chat" width="24" height="24" />
        </CButton>
      </CFooter>
    </div>
  )
}

export default React.memo(AppFooter)
