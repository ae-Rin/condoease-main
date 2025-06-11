import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import ProtectedRoute from '../../shared/ProtectedRoute'

// Ensure the correct path to the routes file
import WebRoutes from '../webRoutes'

const WebAppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense
        fallback={
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        }
      >
        <Routes>
          {WebRoutes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    route.isProtected ? (
                      <ProtectedRoute>{route.element}</ProtectedRoute>
                    ) : (
                      route.element
                    )
                  }
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(WebAppContent)
