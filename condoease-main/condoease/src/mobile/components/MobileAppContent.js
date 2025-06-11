import React from 'react'
import { Routes, Route } from 'react-router-dom'
import mobileRoutes from '../mobileRoutes'

const MobileAppContent = () => {
  return (
    <Routes>
      {mobileRoutes.map((route, idx) => {
        const { path, element } = route
        return <Route key={idx} path={path} element={element} />
      })}
    </Routes>
  )
}

export default MobileAppContent