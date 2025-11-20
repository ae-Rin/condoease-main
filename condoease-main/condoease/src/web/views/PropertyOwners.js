/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
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
  'School ID',
  'Postal ID',
  'Employee ID',
  'Barangay Certificate/Clearance',
  'Company ID',
  'Pag-IBIG Loyalty Card',
  'OWWA Card',
  'NBI Clearance',
  'Military ID',
]

const PropertyOwners = () => {
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
    bankAssociated: '',
    bankAccountNumber: '',
  })

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

    const formData = new FormData()
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key])
    })

    try {
      const res = await fetch('http://localhost:5000/api/property-owners', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!res.ok) throw new Error(await res.text())

      alert('Property owner registered successfully!')
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
        bankAssociated: '',
        bankAccountNumber: '',
      })
    } catch (err) {
      console.error(err)
      alert('Error registering property owner.')
    }
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Register New Property Owner</h4>
      <CCard>
        <CCardHeader className="text-body-secondary">
          <strong>Owner Information</strong>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            {/* Personal Info */}
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>Last Name</strong>
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
                <strong>First Name</strong>
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
                <strong>Email</strong>
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
                <strong>Contact Number</strong>
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
                <strong>Street</strong>
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
                <strong>Barangay</strong>
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
                <strong>City</strong>
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
                <strong>Province</strong>
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
                <strong>Upload ID Document</strong>
                <CFormInput type="file" name="idDocument" onChange={handleFileChange} required />
                <small className="text-muted">
                  Accepted formats: jpg, png, pdf.
                </small>
              </CCol>
            </CRow>

            {/* Bank Information */}
            <strong className="mb-3">Bank Information</strong>
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>Bank Associated</strong>
                <CFormInput
                  type="text"
                  name="bankAssociated"
                  placeholder="Bank Associated"
                  value={formValues.bankAssociated}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <strong>Bank Account Number</strong>
                <CFormInput
                  type="text"
                  name="bankAccountNumber"
                  placeholder="Bank Account Number"
                  value={formValues.bankAccountNumber}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                className="text-white fw-bold px-4"
                style={{ borderRadius: 20, fontSize: 20, backgroundColor: '#F28D35' }}
              >
                Register Owner
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default PropertyOwners