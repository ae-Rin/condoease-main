/* eslint-disable prettier/prettier */
import React from 'react'
import { Navigate } from 'react-router-dom'

// Pages
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
const Announcements = React.lazy(() => import('./views/Announcements'))
const Tables = React.lazy(() => import('./views/Tables'))
const Tenants = React.lazy(() => import('./views/Tenants'))
const TenantList = React.lazy(() => import('./views/TenantList'))
const PropertyOwners = React.lazy(() => import('./views/PropertyOwners'))
const PropertyOwnerList = React.lazy(() => import('./views/PropertyOwnerList'))
const Properties = React.lazy(() => import('./views/Properties'))
const PropertyList = React.lazy(() => import('./views/PropertyList'))
const PropertyUnits = React.lazy(() => import('./views/PropertyUnits'))
const PropertyUnitList = React.lazy(() => import('./views/PropertyUnitList'))
const LeasesTenancy = React.lazy(() => import('./views/LeasesTenancy'))
const LeasesTenancyList = React.lazy(() => import('./views/LeasesTenancyList'))
const LeasesTenancyTerminated = React.lazy(() => import('./views/LeasesTenancyTerminated'))
const MaintenanceRequest = React.lazy(() => import('./views/MaintenanceRequest'))
const Page404 = React.lazy(() => import('./views/page404/Page404'))
const Page500 = React.lazy(() => import('./views/page500/Page500'))

const webRoutes = [
  { path: '/', name: 'Default', element: <Navigate to="/login" replace />, isProtected: false },
  { path: '/login', name: 'Login Page', element: <Login />, isProtected: false },
  { path: '/loginstep2', name: 'Login Step 2', element: <Login2 />, isProtected: false },
  { path: '/register', name: 'Register Page', element: <Register />, isProtected: false },
  {
    path: '/registerstep2',
    name: 'Register Step 2',
    element: <RegisterStep2 />,
    isProtected: false,
  },
  {
    path: '/registerverify',
    name: 'Register Verify',
    element: <RegisterVerify />,
    isProtected: true,
  },
  { path: '/cards', name: 'Cards', element: <Cards />, isProtected: true },
  { path: '/carousel', name: 'Carousel', element: <Carousel />, isProtected: true },
  { path: '/navs', name: 'Navs', element: <Navs />, isProtected: true },
  { path: '/collapses', name: 'Collapses', element: <Collapses />, isProtected: true },
  { path: '/listgroups', name: 'List Groups', element: <ListGroups />, isProtected: true },
  { path: '/tables', name: 'Tables', element: <Tables />, isProtected: true },
  { path: '/tenants', name: 'Tenants', element: <Tenants />, isProtected: true },
  { path: '/tenantlist', name: 'Tenant List', element: <TenantList />, isProtected: true },
  { path: '/propertyowners', name: 'Property Owners', element: <PropertyOwners />, isProtected: true },
  { path: '/propertyownerlist', name: 'Property Owner List', element: <PropertyOwnerList />, isProtected: true },
  { path: '/properties', name: 'Properties', element: <Properties />, isProtected: true },
  { path: '/propertylist', name: 'Property List', element: <PropertyList />, isProtected: true },
  { path: '/propertyunits', name: 'Property Units', element: <PropertyUnits />, isProtected: true },
  { path: '/propertyunitlist', name: 'Property Unit List', element: <PropertyUnitList />, isProtected: true },
  { path: '/leasestenancy', name: 'Lease Tenancy', element: <LeasesTenancy />, isProtected: true },
  { path: '/leasestenancylist', name: 'List of Leases', element: <LeasesTenancyList />, isProtected: true },
  { path: '/leasestenancyterminated', name: 'Terminated Leases', element: <LeasesTenancyTerminated />, isProtected: true },
  { path: '/maintenance-request/:requestId', name: 'Maintenance Request', element: <MaintenanceRequest />, isProtected: true },
  { path: '/404', name: 'Page 404', element: <Page404 />, isProtected: true },
  { path: '/500', name: 'Page 500', element: <Page500 />, isProtected: true },
  {
    path: '*',
    name: 'Not Found',
    element: <Navigate to="/404" replace />,
    isProtected: true,
  },
]

export default webRoutes
