import React from 'react'
import WebAppSidebar from '../components/WebAppSidebar'
import WebAppHeader from '../components/WebAppHeader'
import { Outlet } from 'react-router-dom'

const WebLayout = () => {
  return (
    <div className="d-flex">
      <WebAppSidebar />
      <div className="wrapper d-flex flex-column flex-grow-1 min-vh-100">
        <WebAppHeader />
        <div className="body flex-grow-1 px-3">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default WebLayout
