import React, { Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'

import '../scss/style.scss'
import ProtectedRoute from '../shared/ProtectedRoute'
import WebLayout from './layout/WebLayout'

// Lazy pages
const Login = React.lazy(() => import('./views/login/Login'))
const Login2 = React.lazy(() => import('./views/login/Login2'))
const Register = React.lazy(() => import('./views/register/Register'))
const RegisterStep2 = React.lazy(() => import('./views/register/RegisterStep2'))
const RegisterVerify = React.lazy(() => import('./views/register/RegisterVerify'))

const Cards = React.lazy(() => import('./views/Cards'))
const Carousel = React.lazy(() => import('./views/Carousels'))
const Navs = React.lazy(() => import('./views/Navs'))
const Collapses = React.lazy(() => import('./views/Collapses'))
const ListGroups = React.lazy(() => import('./views/ListGroups'))
const Tables = React.lazy(() => import('./views/Tables'))

const Page404 = React.lazy(() => import('./views/page404/Page404'))
const Page500 = React.lazy(() => import('./views/page500/Page500'))

const WebApp = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) setColorMode(theme)

    if (!isColorModeSet()) setColorMode(storedTheme)
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-5 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/loginstep2" element={<Login2 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerstep2" element={<RegisterStep2 />} />
          <Route path="/registerverify" element={<RegisterVerify />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/404" element={<Page404 />} />

          {/* Protected routes nested inside WebLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WebLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/cards" replace />} />
            <Route path="cards" element={<Cards />} />
            <Route path="carousel" element={<Carousel />} />
            <Route path="navs" element={<Navs />} />
            <Route path="collapses" element={<Collapses />} />
            <Route path="listgroups" element={<ListGroups />} />
            <Route path="tables" element={<Tables />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default WebApp
