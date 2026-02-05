/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CContainer, CCard, CCardBody, CCardHeader, CButton, CSpinner, CBadge } from '@coreui/react'

const InvoiceDetails = () => {
  const { invoiceId } = useParams()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data.detail || data.error || 'Failed to load invoice')
          setInvoice(null)
          return
        }
        setInvoice(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching invoice:', err)
        setError(err.message || 'Failed to load invoice')
        setInvoice(null)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [API_URL, invoiceId])

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

  if (loading) {
    return (
      <CContainer className="mt-5">
        <div className="d-flex justify-content-center align-items-center py-5">
          <CSpinner color="primary" />
          <span className="ms-2">Loading invoice...</span>
        </div>
      </CContainer>
    )
  }

  if (error || !invoice) {
    return (
      <CContainer className="mt-5">
        <p className="text-danger">{error || 'Invoice not found.'}</p>
        <CButton color="secondary" onClick={() => navigate('/listgroups')}>
          Back to Payment Transactions
        </CButton>
      </CContainer>
    )
  }

  return (
    <CContainer className="mt-5">
      <div className="mb-3">
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/listgroups')}
        >
          DASHBOARD
        </span>{' '}
        /{' '}
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/listgroups')}
        >
          PAYMENT TRANSACTIONS
        </span>{' '}
        / <span style={{ color: '#F28D35' }}>INVOICE #{invoice.id}</span>
      </div>

      <h4 className="mb-4">Invoice #{invoice.id}</h4>

      <CCard className="mb-3">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Invoice Information</strong>
          <CBadge color={statusColor(invoice.status)} className="text-uppercase">
            {invoice.status}
          </CBadge>
        </CCardHeader>
        <CCardBody>
          <div className="row mb-2">
            <div className="col-md-3 text-muted">Invoice ID</div>
            <div className="col-md-9">{invoice.id}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 text-muted">Amount</div>
            <div className="col-md-9">{formatAmount(invoice.amount)}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 text-muted">Due date</div>
            <div className="col-md-9">{formatDate(invoice.due_date)}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 text-muted">Status</div>
            <div className="col-md-9">
              <CBadge color={statusColor(invoice.status)}>{invoice.status}</CBadge>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 text-muted">Created</div>
            <div className="col-md-9">
              {invoice.created_at ? new Date(invoice.created_at).toLocaleString() : '—'}
            </div>
          </div>
        </CCardBody>
      </CCard>

      {(invoice.tenant_name || invoice.tenant_email) && (
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Tenant</strong>
          </CCardHeader>
          <CCardBody>
            {invoice.tenant_name && (
              <div className="row mb-2">
                <div className="col-md-3 text-muted">Name</div>
                <div className="col-md-9">{invoice.tenant_name}</div>
              </div>
            )}
            {invoice.tenant_email && (
              <div className="row mb-2">
                <div className="col-md-3 text-muted">Email</div>
                <div className="col-md-9">{invoice.tenant_email}</div>
              </div>
            )}
            <div className="row mb-2">
              <div className="col-md-3 text-muted">Tenant ID</div>
              <div className="col-md-9">{invoice.tenant_id}</div>
            </div>
          </CCardBody>
        </CCard>
      )}

      {(invoice.property_name || invoice.unit_number) && (
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Property / Unit</strong>
          </CCardHeader>
          <CCardBody>
            {invoice.property_name && (
              <div className="row mb-2">
                <div className="col-md-3 text-muted">Property</div>
                <div className="col-md-9">{invoice.property_name}</div>
              </div>
            )}
            {invoice.unit_number && (
              <div className="row mb-2">
                <div className="col-md-3 text-muted">Unit</div>
                <div className="col-md-9">{invoice.unit_number}</div>
              </div>
            )}
            <div className="row mb-2">
              <div className="col-md-3 text-muted">Lease ID</div>
              <div className="col-md-9">{invoice.lease_id}</div>
            </div>
          </CCardBody>
        </CCard>
      )}

      <CButton color="secondary" onClick={() => navigate('/listgroups')}>
        Back to Payment Transactions
      </CButton>
    </CContainer>
  )
}

export default InvoiceDetails
