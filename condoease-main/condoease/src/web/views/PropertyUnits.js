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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const unitTypes = ['Studio', '1-Bedroom', '2-Bedroom', '3-Bedroom', 'Penthouse']

const PropertyUnits = () => {
  const [formValues, setFormValues] = useState({
    property: '',
    unitType: '',
    unitNumber: '',
    commissionPercentage: '',
    rentPrice: '',
    depositPrice: '',
    floor: '',
    size: '',
    description: '',
    unitImages: [],
  })

  const [units, setUnits] = useState([]) // Stores the list of added units

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(
      (file) =>
        file.size <= 5 * 1024 * 1024 &&
        ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
    )
    if (validFiles.length !== files.length) {
      alert('Some files are invalid. Only jpg, png, and gif files under 5MB are accepted.')
    }
    setFormValues((prev) => ({ ...prev, unitImages: validFiles }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Add the new unit to the list of units
    setUnits((prev) => [...prev, formValues])

    // Reset the form
    setFormValues({
      property: '',
      unitType: '',
      unitNumber: '',
      commissionPercentage: '',
      rentPrice: '',
      depositPrice: '',
      floor: '',
      size: '',
      description: '',
      unitImages: [],
    })

    alert('Unit added successfully!')
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Add New Property Unit</h4>
      <CCard>
        <CCardHeader>
          <strong>Unit Information</strong>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect
                  name="property"
                  value={formValues.property}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Property/Building</option>
                  {/* Replace with dynamic property options */}
                  <option value="Building A">Building A</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  name="unitType"
                  value={formValues.unitType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Unit Type</option>
                  {unitTypes.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="unitNumber"
                  placeholder="Unit Number"
                  value={formValues.unitNumber}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  name="commissionPercentage"
                  placeholder="Commission Percentage (%)"
                  value={formValues.commissionPercentage}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  type="number"
                  name="rentPrice"
                  placeholder="Unit Rent Price (₱)"
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
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="floor"
                  placeholder="Unit Floor"
                  value={formValues.floor}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  name="size"
                  placeholder="Unit Size (sqm)"
                  value={formValues.size}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormTextarea
                  name="description"
                  placeholder="Unit Description/Amenities/Features"
                  rows="3"
                  value={formValues.description}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="file"
                  name="unitImages"
                  multiple
                  onChange={handleImageUpload}
                  accept=".jpg,.png,.gif"
                  required
                />
                <small className="text-muted">
                  Upload up to 5 images. Maximum file size: 5MB. Accepted formats: jpg, png, gif.
                </small>
              </CCol>
            </CRow>
            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                style={{ backgroundColor: '#F28D35', color: 'white', fontWeight: 'bold' }}
              >
                Add Unit
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Display Added Units */}
      <CCard className="mt-4">
        <CCardHeader>
          <strong>Added Units</strong>
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Property</CTableHeaderCell>
                <CTableHeaderCell>Unit Type</CTableHeaderCell>
                <CTableHeaderCell>Unit Number</CTableHeaderCell>
                <CTableHeaderCell>Rent Price</CTableHeaderCell>
                <CTableHeaderCell>Deposit Price</CTableHeaderCell>
                <CTableHeaderCell>Floor</CTableHeaderCell>
                <CTableHeaderCell>Size (sqm)</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {units.map((unit, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{unit.property}</CTableDataCell>
                  <CTableDataCell>{unit.unitType}</CTableDataCell>
                  <CTableDataCell>{unit.unitNumber}</CTableDataCell>
                  <CTableDataCell>₱{unit.rentPrice}</CTableDataCell>
                  <CTableDataCell>₱{unit.depositPrice}</CTableDataCell>
                  <CTableDataCell>{unit.floor}</CTableDataCell>
                  <CTableDataCell>{unit.size}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default PropertyUnits