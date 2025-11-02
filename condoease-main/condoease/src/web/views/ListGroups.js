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

const ListGroups = () => {
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [paymentList, setPaymentList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentList = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payment-list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch payment list')
        }

        const data = await res.json()
        setPaymentList(data.payments)
      } catch (err) {
        console.error('Error fetching payment list:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentList()
  }, [API_URL])

  const handleShowPayments = (month, year) => {
    navigate(`/payments/${month}/${year}`)
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Tenant Transactions</h4>
      <div className="mb-3">
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/cards')}
        >
          DASHBOARD
        </span>{' '}
        / <span style={{ color: '#F28D35' }}>TENANT TRANSACTIONS</span>
      </div>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>No.</CTableHeaderCell>
            <CTableHeaderCell>Month and Year</CTableHeaderCell>
            <CTableHeaderCell>Number of Payments</CTableHeaderCell>
            <CTableHeaderCell>Total Due</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="5" className="text-center">
                Loading payment list...
              </CTableDataCell>
            </CTableRow>
          ) : paymentList.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="5" className="text-center">
                No payments found.
              </CTableDataCell>
            </CTableRow>
          ) : (
            paymentList.map((payment, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  {payment.month} {payment.year}
                </CTableDataCell>
                <CTableDataCell>{payment.numberOfPayments}</CTableDataCell>
                <CTableDataCell>${payment.totalDue.toFixed(2)}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => handleShowPayments(payment.month, payment.year)}
                  >
                    Show
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default ListGroups
