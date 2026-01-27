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

const OwnerDetails = () => {
  const { ownerId } = useParams()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [ownerDetails, setOwnerDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [approving, setApproving] = useState(false)
  const [denying, setDenying] = useState(false)
  

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/api/ownerdetails/${ownerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch owner details')
        }
        const data = await res.json()
        setOwnerDetails(data)
      } catch (err) {
        console.error('Error fetching owner details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOwnerDetails()
  }, [API_URL, ownerId])

  const handleUpdateStatus = async (status) => {
    if (status === 'denied' && !comment.trim()) {
      alert('Please provide a reason for denial.')
      return
    }
    if (status === 'approved') {
      setApproving(true)
    } else if (status === 'denied') {
      setDenying(true)
    }
    try {
      const res = await fetch(`${API_URL}/api/owners/${ownerId}/status`, {
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
      alert(`Owner ${status} successfully`)
      navigate('/propertyownerlist', { replace: true })
    } catch (err) {
      alert(err.message)
    } finally {
      setApproving(false)
      setDenying(false)
    }
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Owner Details</h4>
      {loading ? (
        <p>Loading owner details...</p>
      ) : ownerDetails ? (
        <CCard>
          <CCardHeader>
            <h5>
              Owner: {ownerDetails.first_name} {ownerDetails.last_name}
            </h5>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Status:</strong>{' '}
              <span
                style={{
                  color:
                    ownerDetails.status === 'approved'
                      ? 'green'
                      : ownerDetails.status === 'denied'
                        ? 'red'
                        : '#F28D35',
                  fontWeight: 'bold',
                }}
              >
                {ownerDetails.status.toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Email:</strong> {ownerDetails.email}
            </p>
            <p>
              <strong>Contact Number:</strong> {ownerDetails.contact_number}
            </p>
            <p>
              <strong>Full Address:</strong> {ownerDetails.street}, {ownerDetails.barangay},{' '}
              {ownerDetails.city}, {ownerDetails.province}
            </p>
            <p>
              <strong>ID Type:</strong> {ownerDetails.id_type}
            </p>
            <p>
              <strong>ID Number:</strong> {ownerDetails.id_number}
            </p>
            <p>
              <strong>ID Document:</strong>
            </p>
            {ownerDetails.id_documents?.length > 0 ? (
              <ul>
                {ownerDetails.id_documents.map((doc) => (
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
              <strong>Bank Associated:</strong> {ownerDetails.bank_associated}
            </p>
            <p>
              <strong>Bank Account Number:</strong> {ownerDetails.bank_account_number}
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
                disabled={approving || ownerDetails.status !== 'pending'}
                onClick={() => handleUpdateStatus('approved')}
                style={{
                  fontSize: 20,
                  backgroundColor: '#A3C49A',
                  minWidth: '205px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                }}
              >
                {approving ? (
                  <CSpinner style={{ width: '1.8rem', height: '1.8rem', color: '#FFFFFF' }} />
                ) : (
                  'Approve'
                )}
              </CButton>
              <CButton
                className="text-white fw-bold px-4"
                disabled={denying || ownerDetails.status !== 'pending'}
                onClick={() => handleUpdateStatus('denied')}
                style={{
                  fontSize: 20,
                  backgroundColor: 'rgb(242, 53, 59)',
                  minWidth: '205px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                }}
              >
                {denying ? (
                  <CSpinner style={{ width: '1.8rem', height: '1.8rem', color: '#FFFFFF' }} />
                ) : (
                  'Denied'
                )}
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      ) : (
        <p>Owner Details not found.</p>
      )}
    </div>
  )
}
export default OwnerDetails
