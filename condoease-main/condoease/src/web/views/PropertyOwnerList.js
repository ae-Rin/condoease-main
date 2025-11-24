/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'

const PropertyOwnerList = () => {
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await fetch(`${API_URL}/api/property-owners`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch property owners')
        }

        const data = await res.json()
        setOwners(data)
      } catch (err) {
        console.error('Error fetching property owners:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOwners()
  }, [API_URL])

  const handleView = (ownerId) => {
    alert(`View details for owner ID: ${ownerId}`)
  }

  const handleEdit = (ownerId) => {
    alert(`Edit details for owner ID: ${ownerId}`)
  }

  const handleDelete = (ownerId) => {
    if (window.confirm('Are you sure you want to delete this property owner?')) {
      // Delete owner logic here
      alert(`Owner ID ${ownerId} deleted`)
    }
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Registered Property Owners</h4>
      <CRow>
        <CCol>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Fullname</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Contact Number</CTableHeaderCell>
                <CTableHeaderCell>Address</CTableHeaderCell>
                <CTableHeaderCell>Statistics</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow key="loading">
                  <CTableDataCell colSpan="8" className="text-center">
                    Loading property owners...
                  </CTableDataCell>
                </CTableRow>
              ) : owners.length === 0 ? (
                <CTableRow key="no-data">
                  <CTableDataCell colSpan="8" className="text-center">
                    No property owners found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                <>
                  {owners.map((owner) => (
                    <CTableRow key={owner.owner_id}>
                      <CTableDataCell>{owner.owner_id}</CTableDataCell>
                      <CTableDataCell>{`${owner.first_name} ${owner.last_name}`}</CTableDataCell>
                      <CTableDataCell>{owner.email}</CTableDataCell>
                      <CTableDataCell>{owner.contact_number}</CTableDataCell>
                      <CTableDataCell>{`${owner.street}, ${owner.barangay}, ${owner.city}, ${owner.province}`}</CTableDataCell>
                      <CTableDataCell>
                        <div>
                          <strong>Properties:</strong> {owner.number_of_properties || 0}
                        </div>
                        <div>
                          <strong>Units:</strong> {owner.number_of_units || 0}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleView(owner.owner_id)}
                        >
                          <FaEye />
                        </CButton>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(owner.owner_id)}
                        >
                          <FaEdit />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(owner.owner_id)}
                        >
                          <FaTrash />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </>
              )}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default PropertyOwnerList