import React from 'react'
import { Navigate } from 'react-router-dom' // ✅ Add this import

// Mobile-specific views
const Dashboard = React.lazy(() => import('./views/Dashboard'))
const Colors = React.lazy(() => import('./views/Colors'))
const Typography = React.lazy(() => import('./views/Typography'))
const Charts = React.lazy(() => import('./views/Charts'))
const Accordion = React.lazy(() => import('./views/Accordion'))

const mobileRoutes = [
  { path: '/dashboard/*', name: 'Dashboard', element: <Dashboard />, isProtected: false },
  { path: '/colors', name: 'Colors', element: <Colors />, isProtected: false },
  { path: '/typography', name: 'Typography', element: <Typography />, isProtected: false },
  { path: '/charts', name: 'Charts', element: <Charts />, isProtected: false },
  { path: '/accordion', name: 'Accordion', element: <Accordion />, isProtected: false },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
]

export default mobileRoutes
