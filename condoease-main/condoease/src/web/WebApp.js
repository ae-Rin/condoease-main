import React, { Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'

import '../scss/style.scss'
import ProtectedRoute from '../shared/ProtectedRoute'
import WebLayout from './layout/WebLayout'

// Lazy-loaded pages
const Login = React.lazy(() => import('./views/login/Login'))
const Register = React.lazy(() => import('./views/register/Register'))
const RegisterStep2 = React.lazy(() => import('./views/register/RegisterStep2'))
const RegisterVerify = React.lazy(() => import('./views/register/RegisterVerify'))
const Cards = React.lazy(() => import('./views/Cards'))
// const Carousel = React.lazy(() => import('./views/Announcements'))
const Navs = React.lazy(() => import('./views/Navs'))
const Collapses = React.lazy(() => import('./views/Collapses'))
const ListGroups = React.lazy(() => import('./views/ListGroups'))
const Announcements = React.lazy(() => import('./views/Announcements'))
const Tables = React.lazy(() => import('./views/Tables'))
const Tenants = React.lazy(() => import('./views/Tenants'))
const UpdateTenant = React.lazy(() => import('./views/UpdateTenant'))
const TenantList = React.lazy(() => import('./views/TenantList'))
const TenantDetails = React.lazy(() => import('./views/TenantDetails'))
const PropertyOwners = React.lazy(() => import('./views/PropertyOwners'))
const PropertyOwnerList = React.lazy(() => import('./views/PropertyOwnerList'))
const OwnerDetails = React.lazy(() => import('./views/OwnerDetails'))
const Properties = React.lazy(() => import('./views/Properties'))
const PropertyList = React.lazy(() => import('./views/PropertyList'))
const PropertyUnits = React.lazy(() => import('./views/PropertyUnits'))
const PropertyUnitList = React.lazy(() => import('./views/PropertyUnitList'))
const LeasesTenancy = React.lazy(() => import('./views/LeasesTenancy'))
const LeasesTenancyList = React.lazy(() => import('./views/LeasesTenancyList'))
const LeasesTenancyTerminated = React.lazy(() => import('./views/LeasesTenancyTerminated'))
const MaintenanceRequest = React.lazy(() => import('./views/MaintenanceRequest'))
const MaintenanceOngoing = React.lazy(() => import('./views/MaintenanceOngoing'))
const MaintenanceCompleted = React.lazy(() => import('./views/MaintenanceCompleted'))
const ManageAllUsers = React.lazy(() => import('./views/ManageAllUsers'))
const ApplicationLogs = React.lazy(() => import('./views/ApplicationLogs'))

const Page404 = React.lazy(() => import('./views/page404/Page404'))
const Page500 = React.lazy(() => import('./views/page500/Page500'))

const WebApp = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const match = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)
    const theme = match ? match[0] : null

    if (theme) {
      setColorMode(theme)
    } else if (!isColorModeSet()) {
      setColorMode('light')
    }
  }, [isColorModeSet, setColorMode])

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
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerstep2" element={<RegisterStep2 />} />
          <Route path="/registerverify" element={<RegisterVerify />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/404" element={<Page404 />} />

          {/* Protected Routes */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<WebLayout />}>
                    <Route index element={<Navigate to="/cards" replace />} />
                    <Route path="cards" element={<Cards />} />
                    {/* <Route path="carousel" element={<Carousel />} /> */}
                    <Route path="navs" element={<Navs />} />
                    <Route path="collapses" element={<Collapses />} />
                    <Route path="listgroups" element={<ListGroups />} />
                    <Route path="announcements" element={<Announcements />} />
                    <Route path="tables" element={<Tables />} />
                    <Route path="tenants" element={<Tenants />} />
                    <Route path="tenants/edit/:tenantId" element={<UpdateTenant />} />
                    <Route path="tenantlist" element={<TenantList />} />
                    <Route path="tenantdetails/:tenantId" element={<TenantDetails />} />
                    <Route path="propertyowners" element={<PropertyOwners />} />
                    <Route path="propertyownerlist" element={<PropertyOwnerList />} />
                    <Route path="ownerdetails/:ownerId" element={<OwnerDetails />} />
                    <Route path="properties" element={<Properties />} />
                    <Route path="propertylist" element={<PropertyList />} />
                    <Route path="propertyunits" element={<PropertyUnits />} />
                    <Route path="propertyunitlist" element={<PropertyUnitList />} />
                    <Route path="leasestenancy" element={<LeasesTenancy />} />
                    <Route path="leasestenancylist" element={<LeasesTenancyList />} />
                    <Route path="leasestenancyterminated" element={<LeasesTenancyTerminated />} />
                    <Route path="maintenance-request/:requestId" element={<MaintenanceRequest />} />
                    <Route path="maintenance-ongoing/:requestId" element={<MaintenanceOngoing />} />
                    <Route
                      path="maintenance-completed/:requestId"
                      element={<MaintenanceCompleted />}
                    />
                    <Route path="allusers" element={<ManageAllUsers />} />
                    <Route path="applicationlogs" element={<ApplicationLogs />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default WebApp
