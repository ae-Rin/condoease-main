import React, { useState } from 'react'
import { CFooter, CButton } from '@coreui/react'
import { useNavigate, useLocation } from 'react-router-dom'

const MobileAppFooter = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [active, setActive] = useState(location.pathname)

  const buttons = [
    {
      key: '/dashboard',
      onClick: () => navigate('/dashboard'),
      icon: '/src/assets/images/cil-home.svg',
      alt: 'Home',
    },
    {
      key: '/colors',
      onClick: () => navigate('/colors'),
      icon: '/src/assets/images/cil-credit-card.svg',
      alt: 'Payment',
    },
    {
      key: '/charts',
      onClick: () => navigate('/charts'),
      icon: '/src/assets/images/cil-settings.svg',
      alt: 'Settings',
    },
  ]

  return (
    <div className="position-fixed bottom-0 start-0 end-0" style={{ backgroundColor: '#1D2B57' }}>
      <CFooter
        className="d-flex justify-content-around py-4"
        style={{
          backgroundColor: '#1D2B57',
          padding: '0.5rem 1rem',
        }}
      >
        {buttons.map((btn) => (
          <CButton
            key={btn.key}
            color="link"
            onClick={() => {
              setActive(btn.key)
              btn.onClick()
            }}
            className="p-0 border-0 bg-transparent"
          >
            <img
              src={btn.icon}
              alt={btn.alt}
              width="34"
              height="34"
              style={{
                filter:
                  active === btn.key
                    ? 'brightness(0) saturate(100%) invert(61%) sepia(64%) saturate(664%) hue-rotate(348deg) brightness(95%) contrast(97%)' // #F28D35
                    : 'brightness(0) saturate(100%) invert(100%)', // #FFFFFF
                transition: 'filter 0.3s ease',
              }}
            />
          </CButton>
        ))}
      </CFooter>
    </div>
  )
}

export default React.memo(MobileAppFooter)
