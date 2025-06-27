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

const PropertyList = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/properties', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        const data = await res.json()
        setProperties(data)
      } catch (err) {
        console.error('Error fetching properties:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const handleView = (propertyId) => {
    alert(`View details for property ID: ${propertyId}`)
  }

  const handleEdit = (propertyId) => {
    alert(`Edit details for property ID: ${propertyId}`)
  }

  const handleDelete = (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      // Delete property logic here
      alert(`Property ID ${propertyId} deleted`)
    }
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Registered Properties</h4>
      <CRow>
        <CCol>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Property Name</CTableHeaderCell>
                <CTableHeaderCell>Location</CTableHeaderCell>
                <CTableHeaderCell>Property Type</CTableHeaderCell>
                <CTableHeaderCell>Rent Price</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Owner</CTableHeaderCell>
                <CTableHeaderCell>Number of Units</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow key="loading">
                  <CTableDataCell colSpan="8" className="text-center">
                    Loading properties...
                  </CTableDataCell>
                </CTableRow>
              ) : properties.length === 0 ? (
                <CTableRow key="no-data">
                  <CTableDataCell colSpan="8" className="text-center">
                    No properties found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                <>
                  {properties.map((property) => (
                    <CTableRow key={property.property_id}>
                      <CTableDataCell>{property.property_name}</CTableDataCell>
                      <CTableDataCell>
                        {property
                          ? `${property.street}, ${property.barangay}, ${property.city}, ${property.province}`
                          : 'No Address'}
                      </CTableDataCell>
                      <CTableDataCell>{property.property_type}</CTableDataCell>
                      <CTableDataCell>₱{property.rent_price}</CTableDataCell>
                      <CTableDataCell>{property.status}</CTableDataCell>
                      <CTableDataCell>{property.registered_owner}</CTableDataCell>
                      <CTableDataCell>{property.number_of_units || 0}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleView(property.property_id)}
                        >
                          <FaEye />
                        </CButton>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(property.property_id)}
                        >
                          <FaEdit />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(property.property_id)}
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

export default PropertyList
