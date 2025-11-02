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

const TenantList = () => {  
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tenants`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch tenants')
        }

        const data = await res.json()
        setTenants(data)
      } catch (err) {
        console.error('Error fetching tenants:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTenants()
  }, [API_URL])

  const handleView = (tenantId) => {
    alert(`View details for tenant ID: ${tenantId}`)
  }

  const handleEdit = (tenantId) => {
    alert(`Edit details for tenant ID: ${tenantId}`)
  }

  const handleDelete = (tenantId) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      // Delete tenant logic here
      alert(`Tenant ID ${tenantId} deleted`)
    }
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Registered Tenants</h4>
      <CRow>
        <CCol>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Fullname</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Contact Number</CTableHeaderCell>
                <CTableHeaderCell>Address</CTableHeaderCell>
                <CTableHeaderCell>Number of Leases</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow key="loading">
                  <CTableDataCell colSpan="8" className="text-center">
                    Loading tenants...
                  </CTableDataCell>
                </CTableRow>
              ) : tenants.length === 0 ? (
                <CTableRow key="no-data">
                  <CTableDataCell colSpan="8" className="text-center">
                    No tenants found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                <>
                  {tenants.map((tenant) => (
                    <CTableRow key={tenant.tenant_id}>
                      <CTableDataCell>{`${tenant.first_name} ${tenant.last_name}`}</CTableDataCell>
                      <CTableDataCell>{tenant.email}</CTableDataCell>
                      <CTableDataCell>{tenant.contact_number}</CTableDataCell>
                      <CTableDataCell>
                        {`${tenant.street}, ${tenant.barangay}, ${tenant.city}, ${tenant.province}`}
                      </CTableDataCell>
                      <CTableDataCell>{tenant.number_of_leases || 0}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleView(tenant.tenant_id)}
                        >
                          <FaEye />
                        </CButton>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(tenant.tenant_id)}
                        >
                          <FaEdit />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(tenant.tenant_id)}
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

export default TenantList
