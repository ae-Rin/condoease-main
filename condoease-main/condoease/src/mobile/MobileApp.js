import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import '../scss/style.scss'
import ProtectedRoute from '../shared/ProtectedRoute'
import mobileRoutes from './mobileRoutes'
import MobileLayout from './layout/MobileLayout'

const MobileApp = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) return
    setColorMode(storedTheme)
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {mobileRoutes.map((route, idx) => {
            const { path, name, element, isProtected } = route
            return (
              <Route
                key={idx}
                path={path}
                name={name}
                element={
                  isProtected ? (
                    <ProtectedRoute>
                      <MobileLayout>{element}</MobileLayout>
                    </ProtectedRoute>
                  ) : (
                    <MobileLayout>{element}</MobileLayout>
                  )
                }
              />
            )
          })}
          {/* ⬇️ Catch-all fallback route */}
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default MobileApp
