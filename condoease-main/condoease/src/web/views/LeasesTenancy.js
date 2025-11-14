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

  // Fetch properties, units, tenants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyRes, unitRes, tenantRes] = await Promise.all([
          fetch(`${API_URL}/api/properties`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          }),
          fetch(`${API_URL}/api/property-units/vacant`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          }),
          fetch(`${API_URL}/api/tenants`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          }),
        ])

        const propertyData = await propertyRes.json()
        const unitData = await unitRes.json()
        const tenantData = await tenantRes.json()

        setProperties(Array.isArray(propertyData) ? propertyData : [])
        setUnits(Array.isArray(unitData) ? unitData : [])
        setTenants(Array.isArray(tenantData) ? tenantData : [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setProperties([])
        setUnits([])
        setTenants([])
      }
    }

    fetchData()
  }, [API_URL])

  // Compute filtered units dynamically
  const filteredUnits =
    formValues.leaseUnits && formValues.property
      ? units.filter(
          (u) =>
            u.property_id === formValues.property &&
            u.status.toLowerCase() === 'vacant'
        )
      : []

  useEffect(() => {
    if (formValues.leaseUnits && formValues.property) {
      const filtered = units.filter(
        (u) =>
          String(u.property_id).trim() === String(formValues.property).trim() &&
          u.status.toLowerCase() === 'vacant'
      )
      console.log('Selected property:', formValues.property)
      console.log('Filtered Units:', filtered)
    }
  }, [units, formValues.property, formValues.leaseUnits])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'property' ? Number(value) : value,
      ...(name === 'property' && { unit: '' }), // reset unit if property changes
    }))
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === 'leaseUnits' && { unit: '' }), // Reset unit selection if Lease Units unchecked
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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    Object.keys(formValues).forEach((key) => {
      if (key === 'bills') {
        Object.keys(formValues.bills).forEach((billKey) => {
          formData.append(`bills[${billKey}]`, formValues.bills[billKey])
        })
      } else if (key === 'leaseDocuments') {
        formValues.leaseDocuments.forEach((file) =>
          formData.append('leaseDocuments', file)
        )
      } else {
        if (key === 'property') formData.append('property_id', formValues[key])
        else if (key === 'unit') formData.append('property_unit_id', formValues[key])
        else if (key === 'tenant') formData.append('tenant_id', formValues[key])
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
                    <option
                      key={property.property_id}
                      value={property.property_id}
                    >
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
                    {filteredUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
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
                  value={formValues.startDate}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <strong>End of Lease Date</strong>
                <CFormInput
                  type="date"
                  name="endDate"
                  value={formValues.endDate}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* Lease Documents */}
            <CRow className="mb-3">
              <CCol md={12}>
                <strong>Upload Lease Documents</strong>
                <CFormInput
                  type="file"
                  name="leaseDocuments"
                  multiple
                  onChange={handleFileUpload}
                  accept=".jpg,.png,.pdf"
                  required
                />
                <small className="text-muted">Accepted formats: jpg, png, pdf.</small>
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
                {['gas', 'electricity', 'internet', 'tax'].map((bill) => (
                  <CRow className="align-items-center mb-2" key={bill}>
                    <CCol md={6}>
                      <CFormCheck
                        type="checkbox"
                        name={bill}
                        label={bill.charAt(0).toUpperCase() + bill.slice(1)}
                        checked={formValues.bills[bill]}
                        onChange={handleBillsChange}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="number"
                        name={`${bill}Amount`}
                        placeholder="Amount (₱)"
                        value={formValues.bills[`${bill}Amount`] || ''}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value >= 0) {
                            setFormValues((prev) => ({
                              ...prev,
                              bills: { ...prev.bills, [`${bill}Amount`]: value },
                            }))
                          }
                        }}
                        min="0"
                      />
                    </CCol>
                  </CRow>
                ))}
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
