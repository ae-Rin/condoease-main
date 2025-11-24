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
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${API_URL}/api/properties`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch properties')
        }

        const data = await res.json()
        setProperties(data)
      } catch (err) {
        console.error('Error fetching properties:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [API_URL])

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
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Property Name</CTableHeaderCell>
                <CTableHeaderCell>Location</CTableHeaderCell>
                <CTableHeaderCell>Owner</CTableHeaderCell>
                <CTableHeaderCell>Area (sqm)</CTableHeaderCell>
                <CTableHeaderCell>Units</CTableHeaderCell>
                <CTableHeaderCell>Features</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
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
                    <CTableRow key={property.id}>
                      <CTableDataCell>{property.id}</CTableDataCell>
                      <CTableDataCell>{property.property_name}</CTableDataCell>
                      <CTableDataCell>
                        {property
                          ? `${property.street}, ${property.barangay}, ${property.city}, ${property.province}`
                          : 'No Address'}
                      </CTableDataCell>
                      <CTableDataCell>{property.registered_owner}</CTableDataCell>
                      <CTableDataCell>{property.area_measurement || 'N/A' || 0}</CTableDataCell>
                      <CTableDataCell>{property.units || 0}</CTableDataCell>
                      <CTableDataCell>{property.selected_features || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleView(property.id)}
                        >
                          <FaEye />
                        </CButton>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(property.id)}
                        >
                          <FaEdit />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(property.id)}>
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
