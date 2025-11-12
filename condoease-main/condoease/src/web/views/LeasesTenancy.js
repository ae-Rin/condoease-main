/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CFormCheck,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
} from '@coreui/react'

const LeasesTenancy = () => {
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [formValues, setFormValues] = useState({
    property: '',
    leaseUnits: false,
    unit: '',
    rentPrice: '',
    depositPrice: '',
    tenant: '',
    tenantEmail: '',
    startDate: '',
    endDate: '',
    leaseDocuments: [],
    tenancyTerms: '',
    bills: {
      gas: false,
      electricity: false,
      internet: false,
      tax: false,
    },
  })

  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [tenants, setTenants] = useState([])

  useEffect(() => {
    // Fetch registered properties, units, and tenants from the backend API
    const fetchData = async () => {
      try {
        const propertyRes = await fetch(`${API_URL}/api/properties`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        })
        const unitRes = await fetch(`${API_URL}/api/property-units/vacant`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        })
        const tenantRes = await fetch(`${API_URL}/api/tenants`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        })

        const propertyData = await propertyRes.json()
        const unitData = await unitRes.json()
        const tenantData = await tenantRes.json()

        setProperties(propertyData)
        setUnits(unitData)
        setTenants(tenantData)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    fetchData()
  }, [API_URL])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === 'leaseUnits' && { unit: '' }), // Reset unit selection if "Lease Units" is unchecked
    }))
  }

  const handleBillsChange = (e) => {
    const { name, checked } = e.target
    setFormValues((prev) => ({
      ...prev,
      bills: { ...prev.bills, [name]: checked },
    }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormValues((prev) => ({ ...prev, leaseDocuments: files }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    Object.keys(formValues).forEach((key) => {
      if (key === "bills") {
        Object.keys(formValues.bills).forEach((billKey) => {
          formData.append(`bills[${billKey}]`, formValues.bills[billKey])
        })
      } else if (key === "leaseDocuments") {
        formValues.leaseDocuments.forEach((file) =>
          formData.append("leaseDocuments", file)
        )
      } else {
        if (key === "property") formData.append("property_id", formValues[key])
        else if (key === "unit") formData.append("property_unit_id", formValues[key])
        else if (key === "tenant") formData.append("tenant_id", formValues[key])
        else formData.append(key, formValues[key])
      }
    })

    try {
      const res = await fetch(`${API_URL}/api/leases`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      })

      if (!res.ok) throw new Error(await res.text())

      alert('Lease created successfully!')
      setFormValues({
        property: '',
        leaseUnits: false,
        unit: '',
        rentPrice: '',
        depositPrice: '',
        tenant: '',
        tenantEmail: '',
        startDate: '',
        endDate: '',
        leaseDocuments: [],
        tenancyTerms: '',
        bills: {
          gas: false,
          electricity: false,
          internet: false,
          tax: false,
        },
      })
    } catch (err) {
      console.error(err)
      alert('Error creating lease.')
    }
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Create New Lease</h4>
      <CCard>
        <CCardHeader>
          <strong>Lease Information</strong>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            {/* Property Selection */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect
                  name="property"
                  value={formValues.property}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Property/Building</option>
                  {properties.map((property) => (
                    <option key={property.property_id} value={property.property_id}>
                      {property.property_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormCheck
                  type="checkbox"
                  name="leaseUnits"
                  label="Lease Units"
                  checked={formValues.leaseUnits}
                  onChange={handleCheckboxChange}
                />
              </CCol>
            </CRow>

            {/* Unit Selection */}
            {formValues.leaseUnits && (
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormSelect
                    name="unit"
                    value={formValues.unit}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Unit</option>
                    {units
                      .filter(
                        (unit) =>
                          Number(unit.property_id) === Number(formValues.property) &&
                          String(unit.status).toLowerCase() === 'vacant'
                      )
                      .map((unit) => (
                        <option key={unit.property_unit_id} value={unit.property_unit_id}>
                          {unit.unit_number} - {unit.unit_type}
                        </option>
                      ))}
                  </CFormSelect>
                </CCol>
              </CRow>
            )}

            {/* Rent and Deposit */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  type="number"
                  name="rentPrice"
                  placeholder="Rent Price (₱)"
                  value={formValues.rentPrice}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  name="depositPrice"
                  placeholder="Deposit Price (₱)"
                  value={formValues.depositPrice}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* Tenant Selection */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect
                  name="tenant"
                  value={formValues.tenant}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.tenant_id} value={tenant.tenant_id}>
                      {tenant.first_name} {tenant.last_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="email"
                  name="tenantEmail"
                  placeholder="Tenant Email"
                  value={formValues.tenantEmail}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* Lease Dates */}
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>Start of Lease Date</strong>
                <CFormInput
                  type="date"
                  name="startDate"
                  placeholder="Start Date of Lease"
                  value={formValues.startDate}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="date"
                  name="endDate"
                  placeholder="End Date of Lease"
                  value={formValues.endDate}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* Lease Documents */}
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="file"
                  name="leaseDocuments"
                  multiple
                  onChange={handleFileUpload}
                  accept=".jpg,.png,.pdf"
                  required
                />
                <small className="text-muted">
                  Upload lease documents. Accepted formats: jpg, png, pdf.
                </small>
              </CCol>
            </CRow>

            {/* Tenancy Terms */}
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormTextarea
                  name="tenancyTerms"
                  placeholder="Tenancy Terms"
                  rows="3"
                  value={formValues.tenancyTerms}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* Bills */}
            <CRow className="mb-3">
              <CCol md={12}>
                <strong>Bills</strong>
                <CRow className="align-items-center mb-2">
                  <CCol md={6}>
                    <CFormCheck
                      type="checkbox"
                      name="gas"
                      label="Gas"
                      checked={formValues.bills.gas}
                      onChange={handleBillsChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      name="gasAmount"
                      placeholder="Amount (₱)"
                      value={formValues.bills.gasAmount || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value >= 0) {
                          setFormValues((prev) => ({
                            ...prev,
                            bills: { ...prev.bills, gasAmount: value },
                          }))
                        }
                      }}
                      min="0"
                    />
                  </CCol>
                </CRow>
                <CRow className="align-items-center mb-2">
                  <CCol md={6}>
                    <CFormCheck
                      type="checkbox"
                      name="electricity"
                      label="Electricity"
                      checked={formValues.bills.electricity}
                      onChange={handleBillsChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      name="electricityAmount"
                      placeholder="Amount (₱)"
                      value={formValues.bills.electricityAmount || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value >= 0) {
                          setFormValues((prev) => ({
                            ...prev,
                            bills: { ...prev.bills, electricityAmount: value },
                          }))
                        }
                      }}
                      min="0"
                    />
                  </CCol>
                </CRow>
                <CRow className="align-items-center mb-2">
                  <CCol md={6}>
                    <CFormCheck
                      type="checkbox"
                      name="internet"
                      label="Internet"
                      checked={formValues.bills.internet}
                      onChange={handleBillsChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      name="internetAmount"
                      placeholder="Amount (₱)"
                      value={formValues.bills.internetAmount || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value >= 0) {
                          setFormValues((prev) => ({
                            ...prev,
                            bills: { ...prev.bills, internetAmount: value },
                          }))
                        }
                      }}
                      min="0"
                    />
                  </CCol>
                </CRow>
                <CRow className="align-items-center mb-2">
                  <CCol md={6}>
                    <CFormCheck
                      type="checkbox"
                      name="tax"
                      label="Tax"
                      checked={formValues.bills.tax}
                      onChange={handleBillsChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      name="taxAmount"
                      placeholder="Amount (₱)"
                      value={formValues.bills.taxAmount || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value >= 0) {
                          setFormValues((prev) => ({
                            ...prev,
                            bills: { ...prev.bills, taxAmount: value },
                          }))
                        }
                      }}
                      min="0"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                style={{ backgroundColor: '#F28D35', color: 'white', fontWeight: 'bold' }}
              >
                Create Lease
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default LeasesTenancy
