import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

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
    navigate(`/tenantdetails/${tenantId}`)
  }

  const handleEdit = (tenantId) => {
    navigate(`/tenants/edit/${tenantId}`)
  }

  const handleArchive = (tenantId) => {
    if (window.confirm('Are you sure you want to archive this tenant?')) {
      // Archive tenant logic here
      alert(`Tenant ID ${tenantId} archived`)
    }
  }

  return (
    <CContainer className="mt-6">
      <h4 className="mb-5">Registered Tenants</h4>
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
                <CTableHeaderCell>Number of Leases</CTableHeaderCell>
                <CTableHeaderCell>Admin Approval</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow key="loading">
                  <CTableDataCell colSpan="12" className="text-center">
                    Loading tenants...
                  </CTableDataCell>
                </CTableRow>
              ) : tenants.length === 0 ? (
                <CTableRow key="no-data">
                  <CTableDataCell colSpan="12" className="text-center">
                    No tenants found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                <>
                  {tenants.map((tenant) => (
                    <CTableRow key={tenant.tenant_id}>
                      <CTableDataCell>{tenant.tenant_id}</CTableDataCell>
                      <CTableDataCell>{`${tenant.first_name} ${tenant.last_name}`}</CTableDataCell>
                      <CTableDataCell>{tenant.email}</CTableDataCell>
                      <CTableDataCell>{tenant.contact_number}</CTableDataCell>
                      <CTableDataCell>
                        {`${tenant.street}, ${tenant.barangay}, ${tenant.city}, ${tenant.province}`}
                      </CTableDataCell>
                      <CTableDataCell>{tenant.number_of_leases || 0}</CTableDataCell>
                      <CTableDataCell>{tenant.status}</CTableDataCell>
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
                          onClick={() => handleArchive(tenant.tenant_id)}
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
