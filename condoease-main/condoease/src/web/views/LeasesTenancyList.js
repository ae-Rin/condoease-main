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

const LeasesTenancyList = () => {
  const [leases, setLeases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leases', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        const data = await res.json()
        setLeases(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching leases:', err)
        setLoading(false)
      }
    }

    fetchLeases()
  }, [])

  const handleView = (leaseId) => {
    alert(`View details for lease ID: ${leaseId}`)
  }

  const handleEdit = (leaseId) => {
    alert(`Edit details for lease ID: ${leaseId}`)
  }

  const handleDelete = (leaseId) => {
    if (window.confirm('Are you sure you want to delete this lease?')) {
      // Delete lease logic here
      alert(`Lease ID ${leaseId} deleted`)
    }
  }

  const calculateTotalBills = (bills) => {
    return Object.values(bills).reduce((total, amount) => total + (parseFloat(amount) || 0), 0)
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Leases / Tenancy</h4>
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
                    Loading leases...
                  </CTableDataCell>
                </CTableRow>
              ) : leases.length === 0 ? (
                <CTableRow key="no-data">
                  <CTableDataCell colSpan="8" className="text-center">
                    No leases found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                leases.map((lease) => (
                  <CTableRow key={lease.lease_id}>
                    <CTableDataCell>{lease.unit_type}</CTableDataCell>
                    <CTableDataCell>{lease.unit_number}</CTableDataCell>
                    <CTableDataCell>{lease.tenant_email}</CTableDataCell>
                    <CTableDataCell>{lease.start_date.split("T")[0]}</CTableDataCell>
                    <CTableDataCell>{lease.end_date.split("T")[0]}</CTableDataCell>
                    <CTableDataCell>₱{lease.rent_price}</CTableDataCell>
                    <CTableDataCell>
                      ₱
                      {calculateTotalBills({
                        bill_gas_amount: lease.bill_gas_amount,
                        bill_electricity_amount: lease.bill_electricity_amount,
                        bill_internet_amount: lease.bill_internet_amount,
                        bill_tax_amount: lease.bill_tax_amount,
                      })}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleView(lease.lease_id)}
                      >
                        <FaEye />
                      </CButton>
                      <CButton
                        color="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(lease.lease_id)}
                      >
                        <FaEdit />
                      </CButton>
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

export default LeasesTenancyList
