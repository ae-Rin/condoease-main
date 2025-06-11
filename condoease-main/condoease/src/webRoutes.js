import React from 'react'
import { Navigate } from 'react-router-dom'

// Pages
const Login = React.lazy(() => import('./web/views/login/Login'))
const Login2 = React.lazy(() => import('./web/views/login/Login2'))
const Register = React.lazy(() => import('./web/views/register/Register'))
const RegisterStep2 = React.lazy(() => import('./web/views/register/RegisterStep2'))
const Cards = React.lazy(() => import('./web/views/Cards'))
const Carousel = React.lazy(() => import('./web/views/Carousels'))
const Navs = React.lazy(() => import('./web/views/Navs'))
const Collapses = React.lazy(() => import('./web/views/Collapses'))
const ListGroups = React.lazy(() => import('./web/views/ListGroups'))
const Tables = React.lazy(() => import('./web/views/Tables'))
const Page404 = React.lazy(() => import('./web/views/page404/Page404'))
const Page500 = React.lazy(() => import('./web/views/page500/Page500'))

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
