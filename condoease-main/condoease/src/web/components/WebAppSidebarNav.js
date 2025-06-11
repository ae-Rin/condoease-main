import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavGroup, CNavItem, CNavTitle, CSidebarNav } from '@coreui/react'

export const WebAppSidebarNav = ({ items }) => {
  const renderNavLink = (name, icon, badge) => (
    <>
      {icon && <span className="nav-icon">{icon}</span>}
      {name && <span>{name}</span>}
      {badge && (
        <CBadge color={badge.color} className="ms-auto" size="sm">
          {badge.text}
        </CBadge>
      )}
    </>
  )

  const renderNavItem = (item, index) => {
    const { name, icon, badge, to, href, ...rest } = item

    if (to) {
      return (
        <CNavItem key={index} {...rest}>
          <NavLink to={to} className="nav-link">
            {renderNavLink(name, icon, badge)}
          </NavLink>
        </CNavItem>
      )
    }

    if (href) {
      return (
        <CNavItem key={index} {...rest}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="nav-link">
            {renderNavLink(name, icon, badge)}
          </a>
        </CNavItem>
      )
    }

    return null
  }

  const renderNavGroup = (item, index) => {
    const { name, icon, items, ...rest } = item

    return (
      <CNavGroup key={index} toggler={renderNavLink(name, icon)} {...rest}>
        {items?.map((childItem, childIndex) =>
          childItem.items
            ? renderNavGroup(childItem, childIndex)
            : renderNavItem(childItem, childIndex),
        )}
      </CNavGroup>
    )
  }

  const renderNavTitle = (item, index) => {
    const { name, ...rest } = item
    return (
      <CNavTitle key={index} {...rest}>
        {name}
      </CNavTitle>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items.map((item, index) => {
        if (item.component === CNavItem) {
          return renderNavItem(item, index)
        }
        if (item.component === CNavGroup) {
          return renderNavGroup(item, index)
        }
        if (item.component === CNavTitle) {
          return renderNavTitle(item, index)
        }
        return null
      })}
    </CSidebarNav>
  )
}

WebAppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.elementType.isRequired,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      to: PropTypes.string,
      href: PropTypes.string,
      icon: PropTypes.node,
      badge: PropTypes.shape({
        color: PropTypes.string,
        text: PropTypes.string,
      }),
      items: PropTypes.array, // For nested groups
    }),
  ).isRequired,
}
