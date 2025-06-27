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
import { FaTrash } from 'react-icons/fa'

const LeasesTenancyTerminated = () => {
  const [terminatedLeases, setTerminatedLeases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch terminated leases from the backend API
    const fetchTerminatedLeases = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/terminated-leases', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        const data = await res.json()
        setTerminatedLeases(data)
      } catch (err) {
        console.error('Error fetching terminated leases:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTerminatedLeases()
  }, [])

  const handleDelete = (leaseId) => {
    if (window.confirm('Are you sure you want to permanently delete this lease?')) {
      // Delete lease logic here
      alert(`Lease ID ${leaseId} permanently deleted`)
    }
  }

  const calculateTotalBills = (bills) => {
    return Object.values(bills).reduce((total, amount) => total + (parseFloat(amount) || 0), 0)
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Terminated Leases</h4>
      <CRow>
        <CCol>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Unit Type</CTableHeaderCell>
                <CTableHeaderCell>Unit Number</CTableHeaderCell>
                <CTableHeaderCell>Tenant</CTableHeaderCell>
                <CTableHeaderCell>Start Date</CTableHeaderCell>
                <CTableHeaderCell>End Date</CTableHeaderCell>
                <CTableHeaderCell>Rent Price</CTableHeaderCell>
                <CTableHeaderCell>Total Bills</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow key="loading">
                  <CTableDataCell colSpan="8" className="text-center">
                    Loading terminated leases...
                  </CTableDataCell>
                </CTableRow>
              ) : terminatedLeases.length === 0 ? (
                <CTableRow key="no-data">
                  <CTableDataCell colSpan="8" className="text-center">
                    No terminated leases found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                terminatedLeases.map((lease) => (
                  <CTableRow key={lease.lease_id}>
                    <CTableDataCell>{lease.unit_type}</CTableDataCell>
                    <CTableDataCell>{lease.unit_number}</CTableDataCell>
                    <CTableDataCell>{lease.tenant_email}</CTableDataCell>
                    <CTableDataCell>{lease.start_date.split("T")[0]}</CTableDataCell>
                    <CTableDataCell>{lease.end_date.split("T")[0]}</CTableDataCell>
                    <CTableDataCell>₱{lease.rent_price}</CTableDataCell>
                    <CTableDataCell>₱{calculateTotalBills(lease.bills)}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(lease.lease_id)}
                      >
                        <FaTrash />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default LeasesTenancyTerminated