import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormTextarea,
  CButton,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
} from '@coreui/react'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ListGroups = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [appliedTypeFilter, setAppliedTypeFilter] = useState('')
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('')
  const [sortedAsc, setSortedAsc] = useState(true)

  const tenantTransactions = [
    {
      id: 1,
      tenantName: 'John Doe',
      type: 'Rent Payment',
      status: 'Paid',
      description: 'April rent payment',
      time: '09:30 AM',
    },
    {
      id: 2,
      tenantName: 'Jane Smith',
      type: 'Security Deposit',
      status: 'Pending',
      description: 'Initial deposit for unit 101',
      time: '10:45 AM',
    },
    {
      id: 3,
      tenantName: 'Michael Lee',
      type: 'Utility Bill',
      status: 'Overdue',
      description: 'Electricity bill for March',
      time: '02:15 PM',
    },
  ]

  const filteredTransactions = tenantTransactions
    .filter(
      (transaction) =>
        transaction.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (appliedTypeFilter ? transaction.type === appliedTypeFilter : true) &&
        (appliedStatusFilter ? transaction.status === appliedStatusFilter : true),
    )
    .sort((a, b) => (sortedAsc ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)))

  const uniqueTypes = [...new Set(tenantTransactions.map((tx) => tx.type))]
  const uniqueStatuses = [...new Set(tenantTransactions.map((tx) => tx.status))]

  const handleSortClick = () => {
    setAppliedTypeFilter(typeFilter)
    setAppliedStatusFilter(statusFilter)
    setSortedAsc(!sortedAsc)
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Tenant Transactions</h4>
      <div className="mb-3">
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/cards')}
        >
          DASHBOARD
        </span>{' '}
        / <span style={{ color: '#F28D35' }}>TENANT TRANSACTIONS</span>
      </div>

      <CRow>
        <CCol md={4}>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Search Tenant"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>

          <div className="d-flex gap-2 mb-2">
            <CFormSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="" disabled hidden>
                Select Type
              </option>
              {uniqueTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </CFormSelect>

            <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="" disabled hidden>
                Select Status
              </option>
              {uniqueStatuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </CFormSelect>
          </div>

          <CButton
            style={{ backgroundColor: '#F28D35', fontWeight: 'bold' }}
            className="text-white w-100 mb-3"
            onClick={handleSortClick}
          >
            Apply Filter & Sort
          </CButton>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredTransactions.map((transaction) => (
              <CCard
                key={transaction.id}
                className={`mb-3 ${selectedTransaction?.id === transaction.id ? 'border-warning' : 'border-success'}`}
                onClick={() => setSelectedTransaction(transaction)}
                style={{ cursor: 'pointer' }}
              >
                <CCardBody>
                  <h6>
                    {transaction.type} - {transaction.status}
                  </h6>
                  <p className="text-body-secondary small">{transaction.time}</p>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </CCol>

        <CCol md={8}>
          {selectedTransaction ? (
            <CCard className="mb-4 border-warning">
              <CCardHeader>
                <strong>{selectedTransaction.tenantName}</strong>
                <div className="text-body-secondary small">
                  {selectedTransaction.type} - {selectedTransaction.status}
                </div>
              </CCardHeader>
              <CCardBody>
                <p>
                  <strong>Description:</strong> {selectedTransaction.description}
                </p>
                <p>
                  <strong>Proof of Transaction:</strong>
                </p>
                <div className="d-flex gap-2 mb-3">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="border p-3"
                      style={{ width: '100px', height: '80px' }}
                    ></div>
                  ))}
                </div>

                <CFormSelect className="mb-3">
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </CFormSelect>

                <CFormTextarea rows="3" placeholder="Add a comment..." className="mb-3" />

                <div className="d-flex justify-content-end">
                  <CButton color="secondary" className="me-2" style={{ fontWeight: 'bold' }}>
                    Cancel
                  </CButton>
                  <CButton
                    style={{ backgroundColor: '#F28D35', fontWeight: 'bold' }}
                    className="text-white"
                  >
                    Send Decision
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          ) : (
            <p className="text-muted">Select a transaction to view details.</p>
          )}
        </CCol>
      </CRow>
    </div>
  )
}

export default ListGroups
