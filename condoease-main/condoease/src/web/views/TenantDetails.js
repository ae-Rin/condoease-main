/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormTextarea,
  CButton,
  CFormSelect,
  CSpinner,
} from '@coreui/react'

const TenantDetails = () => {
  const { tenantId } = useParams()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [tenantDetails, setTenantDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetchTenantDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tenantdetails/${tenantId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch tenant details')
        }
        const data = await res.json()
        setTenantDetails(data)
      } catch (err) {
        console.error('Error fetching tenant details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTenantDetails()
  }, [API_URL, tenantId])

  const handleUpdateStatus = async (status) => {
    setActionLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/tenants/${tenantId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          status,
          comment,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)

      alert(`Tenant ${status} successfully`)
      navigate('/tenants')
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Tenant Details</h4>
      {loading ? (
        <p>Loading tenant details...</p>
      ) : tenantDetails ? (
        <CCard>
          <CCardHeader>
            <h5>
              Tenant: {tenantDetails.first_name} {tenantDetails.last_name}
            </h5>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Email:</strong> {tenantDetails.email}
            </p>
            <p>
              <strong>Contact Number:</strong> {tenantDetails.contact_number}
            </p>
            <p>
              <strong>Full Address:</strong> {tenantDetails.street}, {tenantDetails.barangay},{' '}
              {tenantDetails.city}, {tenantDetails.province}
            </p>
            <p>
              <strong>ID Type:</strong> {tenantDetails.id_type}
            </p>
            <p>
              <strong>ID Number:</strong> {tenantDetails.id_number}
            </p>
            <p>
              <strong>ID Document:</strong>
            </p>
            {tenantDetails.id_documents?.length > 0 ? (
              <ul>
                {tenantDetails.id_documents.map((doc) => (
                  <li key={doc.id_document_url}>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                      View {doc.file_type.toUpperCase()}
                    </a>{' '}
                    <small className="text-muted">
                      (Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()})
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ID Document uploaded</p>
            )}
            <p>
              <strong>Occupation Status:</strong> {tenantDetails.occupation_status}
            </p>
            <p>
              <strong>Occupation Place:</strong> {tenantDetails.occupation_place}
            </p>
            <p>
              <strong>Emergency Contact:</strong> {tenantDetails.emergency_contact_name} (
              {tenantDetails.emergency_contact_number})
            </p>
            <div className="mt-3">
              <label>
                <strong>If Denied - Provide Reason here...</strong>
              </label>
              <CFormTextarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your remarks & reason here..."
                style={{
                  borderColor: '#A3C49A',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '16px',
                }}
              />
            </div>
            <div className="d-flex justify-content-between mt-4">
              <CButton
                className="text-white fw-bold px-4"
                onClick={() => handleUpdateStatus('approved')}
                disabled={actionLoading}
                style={{
                  fontSize: 20,
                  backgroundColor: '#F28D35',
                  minWidth: '205px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                }}
              >
                {actionLoading ? (
                  <CSpinner style={{ width: '1.8rem', height: '1.8rem', color: '#FFFFFF' }} />
                ) : (
                  'Approve'
                )}
              </CButton>
              <CButton
                className="text-white fw-bold px-4"
                onClick={() => handleUpdateStatus('denied')}
                disabled={loading}
                style={{
                  fontSize: 20,
                  backgroundColor: '#F28D35',
                  minWidth: '205px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                }}
              >
                {loading ? (
                  <CSpinner style={{ width: '1.8rem', height: '1.8rem', color: '#FFFFFF' }} />
                ) : (
                  'Denied'
                )}
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      ) : (
        <p>Tenant Details not found.</p>
      )}
    </div>
  )
}
export default TenantDetails
