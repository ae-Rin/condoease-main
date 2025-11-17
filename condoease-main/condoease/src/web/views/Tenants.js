/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'

const idTypes = [
  // Primary Government-Issued IDs
  'Philippine Passport',
  "Driver's License",
  'National ID (PhilSys)',
  'UMID Card',
  'PRC ID',
  'SSS ID',
  "Voter's ID",
  'Senior Citizen ID',
  'PhilHealth ID',
  'TIN Card',
  // Secondary Government-Issued IDs
  'School ID',
  'Postal ID',
  'Employee ID',
  'Barangay Certificate/Clearance',
  'Company ID',
  'Pag-IBIG Loyalty Card',
  'OWWA Card',
  'NBI Clearance',
  // Other
  'Military ID',
]

const Tenants = () => {
  const [formValues, setFormValues] = useState({
    lastName: '',
    firstName: '',
    email: '',
    contactNumber: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    idType: '',
    idNumber: '',
    idDocument: null,
    occupationStatus: '',
    occupationPlace: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const API_URL = import.meta.env.VITE_APP_API_URL

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormValues((prev) => ({ ...prev, idDocument: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const formData = new FormData()
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key])
    })

    try {
      const res = await fetch(`${API_URL}/api/tenants`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.detail || 'Unknown error')
      }

      alert('Tenant registered successfully!')
      setFormValues({
        lastName: '',
        firstName: '',
        email: '',
        contactNumber: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        idType: '',
        idNumber: '',
        idDocument: null,
        occupationStatus: '',
        occupationPlace: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
      })
    } catch (err) {
      console.error('Error submitting tenant:', err)
      setErrorMessage(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">REGISTER NEW TENANT</h4>
      <CCard>
        <CCardHeader className="text-body-secondary">
          <strong>TENANT INFORMATION</strong>
        </CCardHeader>
        <CCardBody>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <CForm onSubmit={handleSubmit}>
            {/* Personal Info */}
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>LAST NAME</strong>
                <CFormInput
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <strong>FIRST NAME</strong>
                <CFormInput
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>EMAIL</strong>
                <CFormInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <strong>CONTACT NUMBER</strong>
                <CFormInput
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={formValues.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* Address Section */}
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>STREET</strong>
                <CFormInput
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formValues.street}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <strong>BARANGAY</strong>
                <CFormInput
                  type="text"
                  name="barangay"
                  placeholder="Barangay"
                  value={formValues.barangay}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>CITY</strong>
                <CFormInput
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formValues.city}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <strong>PROVINCE</strong>
                <CFormInput
                  type="text"
                  name="province"
                  placeholder="Province"
                  value={formValues.province}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* ID Section */}
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>ID TYPE</strong>
                <CFormSelect
                  name="idType"
                  value={formValues.idType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select ID Type</option>
                  {idTypes.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <strong>ID NUMBER</strong>
                <CFormInput
                  type="text"
                  name="idNumber"
                  placeholder="ID Number"
                  value={formValues.idNumber}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput type="file" name="idDocument" onChange={handleFileChange} required />
              </CCol>
            </CRow>

            {/* Occupation */}
            {/* <hr className="my-4" /> */}
            <h5 className="mb-3">PLACE OF WORK / SCHOOL</h5>
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>OCCUPATION STATUS</strong>
                <CFormSelect
                  name="occupationStatus"
                  value={formValues.occupationStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Occupation Status</option>
                  <option value="employee">Employee</option>
                  <option value="employer">Employer</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="student">Student</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <strong>COMPANY / SCHOOL NAME</strong>
                <CFormInput
                  type="text"
                  name="occupationPlace"
                  placeholder="Company / School Name"
                  value={formValues.occupationPlace}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* Emergency */}
            {/* <hr className="my-4" /> */}
            <h5 className="mb-3">EMERGENCY CONTACT</h5>
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>CONTACT NAME</strong>
                <CFormInput
                  type="text"
                  name="emergencyContactName"
                  placeholder="Emergency Contact Name"
                  value={formValues.emergencyContactName}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <strong>CONTACT NUMBER</strong>
                <CFormInput
                  type="text"
                  name="emergencyContactNumber"
                  placeholder="Emergency Contact Number"
                  value={formValues.emergencyContactNumber}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                style={{ backgroundColor: '#F28D35', color: 'white', fontWeight: 'bold' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Register Tenant'}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Tenants
