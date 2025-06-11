import React from 'react'
import MobileAppHeader from '../components/MobileAppHeader'
import MobileAppFooter from '../components/MobileAppFooter'

const MobileLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <MobileAppHeader />
      {/* Main Content */}
      <div className="body flex-grow-1 px-3">
        {children} {/* ✅ Route content like Dashboard will render here */}
      </div>
      {/* Footer */}
      <MobileAppFooter />
    </div>
  )
}

export default MobileLayout
