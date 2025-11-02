/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CFormTextarea, CButton, CFormSelect } from '@coreui/react'

const MaintenanceRequest = () => {
const { requestId } = useParams()
const navigate = useNavigate()
const API_URL = import.meta.env.VITE_APP_API_URL
const [requestDetails, setRequestDetails] = useState(null)
const [loading, setLoading] = useState(true)
const [comment, setComment] = useState('')
const [status, setStatus] = useState('')

useEffect(() => {
const fetchRequestDetails = async () => {
     try {
     const res = await fetch(`${API_URL}/api/maintenance-requests/${requestId}`, {
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
try {
     const res = await fetch(`${API_URL}/api/maintenance-requests/${requestId}`, {
     method: 'PUT',
     headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
     },
     body: JSON.stringify({ status, comment }),
     })

     if (!res.ok) {
     const errorData = await res.json()
     throw new Error(errorData.error || 'Failed to update status')
     }

     alert('Status updated successfully!')
     navigate('/collapses')
} catch (err) {
     console.error('Error updating status:', err)
}
}

return (
<div className="container" style={{ padding: '20px' }}>
     <h4 className="mb-3">Maintenance Request Details</h4>
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
     / <span style={{ color: '#F28D35' }}>MAINTENANCE REQUEST DETAILS</span>
     </div>
     {loading ? (
     <p>Loading request details...</p>
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
          {requestDetails.attachments && requestDetails.attachments.length > 0 && (
          <>
               <p>
               <strong>Images & Videos:</strong>
               </p>
               <div style={{ display: 'flex', gap: '10px' }}>
               {requestDetails.attachments.map((file, index) => (
                    <div
                    key={index}
                    style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                    >
                    {file.file_type.startsWith('image') ? (
                    <img
                         src={`${API_URL}${file.file_url}`}
                         alt={`Attachment ${index + 1}`}
                         style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                    ) : (
                    <a
                         href={`${API_URL}${file.file_url}`}
                         target="_blank"
                         rel="noopener noreferrer"
                    >
                         {file.file_url.split('/').pop()}
                    </a>
                    )}
                    </div>
               ))}
               </div>
          </>
          )}
          <div className="mt-4">
          <CFormSelect
               value={status}
               onChange={(e) => setStatus(e.target.value)}
               style={{
               borderColor: '#A3C49A',
               borderRadius: '8px',
               padding: '10px',
               fontSize: '16px',
               }}
          >
               <option value="approved">Approve</option>
               <option value="rejected">Reject</option>
          </CFormSelect>
          </div>
          <div className="mt-3">
          <h6>Comment</h6>
          <CFormTextarea
               rows="3"
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               placeholder="Add your comment here..."
               style={{
               borderColor: '#A3C49A',
               borderRadius: '8px',
               padding: '10px',
               fontSize: '16px',
               }}
          />
          </div>
          <div className="d-flex justify-content-end mt-4">
          <CButton
               color="secondary"
               className="me-2"
               onClick={() => navigate('/collapses')}
               style={{ fontWeight: 'bold' }}
          >
               Cancel
          </CButton>
          <CButton
               onClick={handleUpdateStatus}
               style={{ backgroundColor: '#F28D35', color: 'white', fontWeight: 'bold' }}
          >
               Send Decision
          </CButton>
          </div>
          </CCardBody>
     </CCard>
     ) : (
     <p>Request not found.</p>
     )}
</div>
)
}

export default MaintenanceRequest
