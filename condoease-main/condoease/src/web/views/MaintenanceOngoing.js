/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CFormTextarea, CButton, CFormSelect } from '@coreui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const MaintenanceOngoing = () => {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [requestDetails, setRequestDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resolutionSummary, setResolutionSummary] = useState('')
  const [status, setStatus] = useState('')
  const [completedAt, setCompletedAt] = useState(null)
  const [totalCost, setTotalCost] = useState('')
  const [warrantInfo, setWarrantInfo] = useState('')
  const [invoiceFile, setInvoiceFile] = useState(null)

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/api/maintenance-ongoing/${requestId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch request details')
        }

        const data = await res.json()
        setRequestDetails(data)
        setStatus(data.status)
      } catch (err) {
        console.error('Error fetching request details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequestDetails()
  }, [API_URL, requestId])

  const handleUpdateStatus = async () => {
    if (status === 'completed' && !completedAt) {
      alert('Please select a completion date for the completed request.')
      return
    }
    else if (!resolutionSummary.trim()) {
      alert('Resolution summary is required.')
      return
    }

    const formData = new FormData()
    formData.append('status', 'completed')
    formData.append('resolution_summary', resolutionSummary)
    formData.append('completed_at', completedAt ? completedAt.toISOString() : null)
    if (totalCost) formData.append('total_cost', totalCost)
    if (warrantInfo) formData.append('warranty_info', warrantInfo)
    if (invoiceFile) formData.append('invoice', invoiceFile)

    try {
      const res = await fetch(`${API_URL}/api/maintenance-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      })
      
      if (!res.ok) throw new Error('Failed to complete maintenance request')
      alert('Maintenance marked as completed!')
      navigate('/collapses')
    } catch (err) {
      console.error('Error completing maintenance:', err)
    }
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Ongoing Maintenance Request</h4>
      <div className="mb-3">
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/cards')}
        >
          DASHBOARD
        </span>{' '}
        /{' '}
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/collapses')}
        >
          MAINTENANCE TRACKING
        </span>{' '}
        / <span style={{ color: '#F28D35' }}>ONGOING MAINTENANCE REQUEST</span>
      </div>
      {loading ? (
        <p>Loading ongoing maintenance request...</p>
      ) : requestDetails ? (
        <CCard>
          <CCardHeader>
            <h5>
              Tenant: {requestDetails.first_name} {requestDetails.last_name}
            </h5>
            <p style={{ color: '#888', marginBottom: 0 }}>
              {requestDetails.maintenance_type} | {requestDetails.category}
            </p>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Type of Maintenance:</strong> {requestDetails.maintenance_type}
            </p>
            <p>
              <strong>Category:</strong> {requestDetails.category}
            </p>
            <p>
              <strong>Description:</strong> {requestDetails.description}
            </p>
            {requestDetails.scheduled_at && (
              <p>
                <strong>Scheduled Date & Time:</strong>{' '}
                {new Date(requestDetails.scheduled_at).toLocaleString()}
              </p>
            )}

            {requestDetails.admin_comment && (
              <div className="mt-3">
                <h6>Admin Comments/Remarks</h6>
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                  }}
                >
                  {requestDetails.admin_comment}
                </div>
              </div>
            )}
            <div className="mt-3">
              <h6>Resolution Summary</h6>
              <CFormTextarea
                rows="3"
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                placeholder="Write what was done here..."
                style={{
                  borderColor: '#A3C49A',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '16px',
                }}
              />
            </div>
            <div className="mt-3">
              <h6>Completion Date & Time</h6>
              <DatePicker
                selected={completedAt}
                onChange={(date) => setCompletedAt(date)}
                showTimeSelect
                dateFormat="Pp"
                className="form-control"
              />
            </div>
            <div className="mt-3">
              <h6>Total Cost (Optional)</h6>
              <input
                type="number"
                className="form-control"
                placeholder="₱0.00"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <h6>Attach Invoice / Receipt (Optional)</h6>
              <input
                type="file"
                className="form-control"
                accept="image/*,.pdf"
                onChange={(e) => setInvoiceFile(e.target.files[0])}
              />
            </div>
            <div className="mt-3">
              <h6>Warranty Information (Optional)</h6>
              <CFormTextarea
                rows="2"
                value={warrantyInfo}
                onChange={(e) => setWarrantyInfo(e.target.value)}
                placeholder="Warranty duration, coverage, notes..."
              />
            </div>
            <div className="d-flex justify-content-end mt-4">
              <CButton
                onClick={handleUpdateStatus}
                style={{ backgroundColor: '#F28D35', color: 'white', fontWeight: 'bold' }}
              >
                testasdasdasd
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      ) : (
        <p>Ongoing Request not found.</p>
      )}
    </div>
  )
}

export default MaintenanceOngoing
