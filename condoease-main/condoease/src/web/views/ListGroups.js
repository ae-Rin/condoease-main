import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CContainer,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CBadge,
} from '@coreui/react'

const ListGroups = () => {
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [invoices, setInvoices] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setError(null)
        const res = await fetch(`${API_URL}/api/invoices?page=${page}&page_size=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          const msg = data.detail || data.error || 'Failed to fetch invoices'
          setError(Array.isArray(msg) ? msg.join('; ') : msg)
          setInvoices([])
          setTotal(0)
          return
        }

        setInvoices(Array.isArray(data.invoices) ? data.invoices : [])
        setTotal(typeof data.total === 'number' ? data.total : 0)
      } catch (err) {
        console.error('Error fetching invoices:', err)
        setError(err.message || 'Failed to fetch invoices')
        setInvoices([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [API_URL, page])

  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoicedetails/${invoiceId}`)
  }

  const statusColor = (status) => {
    if (!status) return 'secondary'
    const s = String(status).toUpperCase()
    if (s === 'PAID') return 'success'
    if (s === 'OVERDUE') return 'danger'
    return 'warning'
  }

  const formatAmount = (amount) => {
    if (amount == null) return '—'
    return `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (d) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return d
    }
  }

  return (
    <CContainer className="mt-4" style={{ padding: '20px' }}>
      <h4 className="mb-3">Payment Transactions</h4>
      <div className="mb-3">
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/cards')}
        >
          DASHBOARD
        </span>{' '}
        / <span style={{ color: '#F28D35' }}>PAYMENT TRANSACTIONS</span>
      </div>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Invoice ID</CTableHeaderCell>
            <CTableHeaderCell>Amount</CTableHeaderCell>
            <CTableHeaderCell>Due date</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="5" className="text-center py-4">
                Loading invoices...
              </CTableDataCell>
            </CTableRow>
          ) : invoices.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="5" className="text-center py-4">
                No invoices found.
              </CTableDataCell>
            </CTableRow>
          ) : (
            invoices.map((inv) => (
              <CTableRow
                key={inv.id}
                style={{ cursor: 'pointer' }}
                onClick={() => handleViewInvoice(inv.id)}
              >
                <CTableDataCell>{inv.id}</CTableDataCell>
                <CTableDataCell>{formatAmount(inv.amount)}</CTableDataCell>
                <CTableDataCell>{formatDate(inv.due_date)}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={statusColor(inv.status)} className="text-uppercase">
                    {inv.status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell onClick={(e) => e.stopPropagation()}>
                  <CButton color="info" size="sm" onClick={() => handleViewInvoice(inv.id)}>
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>

      {total > pageSize && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </small>
          <div>
            <CButton
              color="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="me-2"
            >
              Previous
            </CButton>
            <CButton
              color="secondary"
              size="sm"
              disabled={page * pageSize >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </CButton>
          </div>
        </div>
      )}
    </CContainer>
  )
}

export default ListGroups
