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

const PropertyUnitList = () => {
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(`${API_URL}/api/property-units`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })

        if (!res.ok){
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch property units')
        }

        const data = await res.json()
        setUnits(data)
      } catch (err) {
        console.error('Error fetching property units:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUnits()
  }, [API_URL])

  const handleView = (unitId) => {
    alert(`View details for unit ID: ${unitId}`)
  }

  const handleEdit = (unitId) => {
    alert(`Edit details for unit ID: ${unitId}`)
  }

  const handleDelete = (unitId) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      // Delete unit logic here
      alert(`Unit ID ${unitId} deleted`)
    }
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Registered Property Units</h4>
      <CRow>
        <CCol>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Property/Building Name</CTableHeaderCell>
                <CTableHeaderCell>Unit Type</CTableHeaderCell>
                <CTableHeaderCell>Unit Number</CTableHeaderCell>
                <CTableHeaderCell>Rent Price</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow key="loading">
                  <CTableDataCell colSpan="8" className="text-center">
                    Loading property units...
                  </CTableDataCell>
                </CTableRow>
              ) : units.length === 0 ? (
                <CTableRow key="no-data">
                  <CTableDataCell colSpan="6" className="text-center">
                    No property units found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                <>
                  {units.map((unit) => (
                    <CTableRow key={unit.property_unit_id}>
                      <CTableDataCell>{unit.property_name}</CTableDataCell>
                      <CTableDataCell>{unit.unit_type}</CTableDataCell>
                      <CTableDataCell>{unit.unit_number}</CTableDataCell>
                      <CTableDataCell>₱{unit.rent_price}</CTableDataCell>
                      <CTableDataCell>{unit.status}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleView(unit.property_unit_id)}
                        >
                          <FaEye />
                        </CButton>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(unit.property_unit_id)}
                        >
                          <FaEdit />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(unit.property_unit_id)}
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

export default PropertyUnitList
