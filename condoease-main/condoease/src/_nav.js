import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilCreditCard,
  cilSettings,
  cilPuzzle,
  cilBullhorn,
  cilUser,
  cilGroup,
  cilBuilding,
  cilHouse,
  cilFile,
  cilClipboard,
  cilChart,
} from '@coreui/icons'
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
    name: 'Condominium Information',
  },
  {
    component: CNavGroup,
    name: 'Tenants',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Register A Tenant', to: '/tenants' },
      { component: CNavItem, name: 'Tenant List', to: '/tenantlist' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Property Owners',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Register A Property Owner', to: '/propertyowners' },
      { component: CNavItem, name: 'Property Owner List', to: '/propertyownerlist' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Properties',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Register A Property', to: '/properties' },
      { component: CNavItem, name: 'Property List', to: '/propertylist' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Property Units',
    icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Register A Property Unit', to: '/propertyunits' },
      { component: CNavItem, name: 'Property Unit List', to: '/propertyunitlist' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Leases / Tenancy',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Create A Lease', to: '/leasestenancy' },
      { component: CNavItem, name: 'List of Leases', to: '/leasestenancylist' },
      { component: CNavItem, name: 'Terminated Leases', to: '/leasestenancyterminated' },
    ],
  },
  {
    component: CNavTitle,
    name: 'Communication',
  },
  {
    component: CNavItem,
    name: 'Announcements',
    to: '/announcements',
    icon: <CIcon icon={cilBullhorn} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Financial Management',
  },
  {
    component: CNavItem,
    name: 'Payment Transactions',
    to: '/invoicedetails',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Maintenance Management',
  },
  {
    component: CNavItem,
    name: 'Maintenance Tracking',
    to: '/collapses',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'User & System Management',
  },
  {
    component: CNavItem,
    name: 'Manage All Users',
    to: '/allusers',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Application Logs',
    to: '/applicationlogs',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
]

export default _nav
