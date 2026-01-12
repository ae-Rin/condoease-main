/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'

const MaintenanceCompleted = () => {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [requestDetails, setRequestDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/api/maintenance-completed/${requestId}`, {
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

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Completed Maintenance Request</h4>
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
        / <span style={{ color: '#F28D35' }}>COMPLETED MAINTENANCE REQUEST</span>
      </div>
      {loading ? (
        <p>Loading completed maintenance request...</p>
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
                <strong>Comments/Remarks</strong>
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
              <strong>Resolution Summary</strong>
              <div
                style={{
                  borderColor: '#A3C49A',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '16px',
                }}
              >
                {requestDetails.resolution_summary}
              </div>
            </div>
            <div className="mt-3">
              <strong>Completion Date & Time</strong>
              <div
                style={{
                  borderColor: '#A3C49A',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '16px',
                }}
              >
                {new Date(requestDetails.completed_at).toLocaleString()}
              </div>
            </div>
            <div className="mt-3">
              <h6>Total Cost (Optional)</h6>
              <div
                style={{
                  borderColor: '#A3C49A',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '16px',
                }}
              >
                {requestDetails.total_cost ? `₱${requestDetails.total_cost}` : 'N/A'}
              </div>
            </div>
            <div className="mt-3">
              <h6>Attach Receipt (Optional)</h6>
              {requestDetails.invoice_url ? (
                <a
                  href={`${API_URL}${requestDetails.invoice_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Receipt
                </a>
              ) : (
                'N/A'
              )}
            </div>
            <div className="mt-3">
              <h6>Warranty Information (Optional)</h6>
              <div
                style={{
                  borderColor: '#A3C49A',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '16px',
                }}
              >
                {requestDetails.warranty_info || 'N/A'}
              </div>
            </div>
          </CCardBody>
        </CCard>
      ) : (
        <p>Completed Request not found.</p>
      )}
    </div>
  )
}

export default MaintenanceCompleted
