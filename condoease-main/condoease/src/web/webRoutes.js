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
const Tables = React.lazy(() => import('./views/Tables'))
const Page404 = React.lazy(() => import('./views/page404/Page404'))
const Page500 = React.lazy(() => import('./views/page500/Page500'))

const webRoutes = [
  { path: '/', name: 'Default', element: <Navigate to="/login" replace />, isProtected: false },
  { path: '/login', name: 'Login Page', element: <Login />, isProtected: false },
  { path: '/loginstep2', name: 'Login Step 2', element: <Login2 />, isProtected: false }, // Added trailing "/*"
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
    isProtected: false,
  },
  { path: '/cards', name: 'Cards', element: <Cards />, isProtected: true },
  { path: '/carousel', name: 'Carousel', element: <Carousel />, isProtected: true },
  { path: '/navs', name: 'Navs', element: <Navs />, isProtected: true },
  { path: '/collapses', name: 'Collapses', element: <Collapses />, isProtected: true },
  { path: '/listgroups', name: 'List Groups', element: <ListGroups />, isProtected: true },
  { path: '/tables', name: 'Tables', element: <Tables />, isProtected: true },
  { path: '/404', name: 'Page 404', element: <Page404 />, isProtected: false },
  { path: '/500', name: 'Page 500', element: <Page500 />, isProtected: false },
  {
    path: '*',
    name: 'Not Found',
    element: <Navigate to="/404" replace />,
    isProtected: false,
  },
]

export default webRoutes
