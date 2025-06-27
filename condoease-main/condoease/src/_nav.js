import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilHome, cilCreditCard, cilSettings, cilPuzzle } from '@coreui/icons'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/cards',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'User Info',
  },
  {
    component: CNavGroup,
    name: 'Tenants',
    to: '/tenants',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Register A Tenant',
        to: '/tenants',
      },
      {
        component: CNavItem,
        name: 'Tenant List',
        to: '/tenantlist',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Property Owners',
    to: '/propertyowners',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Register A Property Owner',
        to: '/propertyowners',
      },
      {
        component: CNavItem,
        name: 'Property Owner List',
        to: '/propertyownerlist',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Properties',
    to: '/properties',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Register A Property',
        to: '/properties',
      },
      {
        component: CNavItem,
        name: 'Property List',
        to: '/propertylist',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Property Units',
    to: '/propertyunits',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Register A Property Unit',
        to: '/propertyunits',
      },
      {
        component: CNavItem,
        name: 'Property Unit List',
        to: '/propertyunitlist',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Leases / Tenancy',
    to: '/leasestenancy',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Create A Lease',
        to: '/leasestenancy',
      },
      {
        component: CNavItem,
        name: 'List of Leases',
        to: '/leasestenancylist',
      },
      {
        component: CNavItem,
        name: 'Terminated Leases',
        to: '/leasestenancyterminated',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Tenants Transactions',
    to: '/listgroups',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Maintenance Information',
    to: '/collapses',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
