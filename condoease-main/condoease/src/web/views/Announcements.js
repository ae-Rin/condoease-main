/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'

const Announcements = () => {
  const API_URL = import.meta.env.VITE_APP_API_URL

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Announcements</h4>
      <div className="mb-3">
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/cards')}
        >
          DASHBOARD
        </span>{' '}
        / <span style={{ color: '#F28D35' }}>ANNOUNCEMENTS</span>
      </div>

      
    </div>
  )
}

export default Announcements
