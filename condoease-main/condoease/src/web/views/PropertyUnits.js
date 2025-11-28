import React, { useState, useEffect } from 'react'
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
  CSpinner,
} from '@coreui/react'

const unitTypes = ['Studio', '1-Bedroom', '2-Bedroom', '3-Bedroom', 'Penthouse']

const PropertyUnits = () => {
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${API_URL}/api/properties`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        })
        if (!res.ok) throw new Error('Failed to fetch properties')
        const data = await res.json()
        setProperties(data)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    const fetchUnits = async () => {
      try {
        const res = await fetch(`${API_URL}/api/property-units`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        })
        if (!res.ok) throw new Error('Failed to fetch property units')
        const data = await res.json()
        setUnits(data)
      } catch (err) {
        console.error('Error fetching units:', err)
      }
    }

    fetchUnits()
    fetchProperties()
  }, [API_URL])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    const missing = []
    if (!formValues.property) missing.push('Please select a property.')
    if (!formValues.unitType) missing.push('Please select a unit type.')
    if (!formValues.unitNumber) missing.push('Please enter the unit number.')
    if (!formValues.commissionPercentage) missing.push('Please enter commission %.')
    if (!formValues.rentPrice) missing.push('Please enter rent price.')
    if (!formValues.depositPrice) missing.push('Please enter deposit price.')
    if (!formValues.floor) missing.push('Please enter floor.')
    if (!formValues.size) missing.push('Please enter size.')
    if (!formValues.description) missing.push('Please enter description.')
    if (formValues.unitImages.length === 0) missing.push('Please upload images.')
    if (missing.length > 0) {
      setErrorMessage(missing.join('\n'))
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('propertyId', formValues.property)
    formData.append('unitType', formValues.unitType)
    formData.append('unitNumber', formValues.unitNumber)
    formData.append('commissionPercentage', formValues.commissionPercentage)
    formData.append('rentPrice', formValues.rentPrice)
    formData.append('depositPrice', formValues.depositPrice)
    formData.append('floor', formValues.floor)
    formData.append('size', formValues.size)
    formData.append('description', formValues.description)
    formValues.unitImages.forEach((img) => formData.append('unitImages', img))

    try {
      const res = await fetch(`${API_URL}/api/property-units`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      // if (!res.ok) throw new Error('Failed to save unit.')
      // if (!res.ok) throw new Error(await res.text())
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || 'Failed to save unit.')
      }

      alert('Unit added successfully!')
      setUnits((prev) => [...prev, formValues])
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
    } catch (err) {
      console.error('Error submitting unit:', err)
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Register New Property Unit</h4>
      <CCard>
        <CCardHeader className="text-body-secondary">
          <strong>Unit Information</strong>
        </CCardHeader>
        <CCardBody>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
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
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.property_name}
                    </option>
                  ))}
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
                <strong>Unit Number</strong>
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
                <strong>Commission Percentage (%)</strong>
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
                <strong>Unit Rent Price (₱)</strong>
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
                <strong>Deposit Price (₱)</strong>
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
                <strong>Unit Floor</strong>
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
                <strong>Unit Size (sqm)</strong>
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
                <strong>Unit Description/Amenities/Features</strong>
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
                <strong>Upload Unit Images</strong>
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
                className="text-white fw-bold px-4"
                style={{
                  borderRadius: 20,
                  fontSize: 20,
                  backgroundColor: '#F28D35',
                  minWidth: '205px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                }}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <CSpinner style={{ width: '2rem', height: '2rem', color: '#FFFFFF' }} />
                ) : (
                  'Add Unit'
                )}
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
                <CTableHeaderCell>ID</CTableHeaderCell>
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
                  <CTableDataCell>{unit.id}</CTableDataCell>
                  <CTableDataCell>{unit.property_name}</CTableDataCell>
                  {/* <CTableDataCell>
                    {properties.find((p) => p.id === Number(unit.property))?.property_name}
                  </CTableDataCell> */}
                  <CTableDataCell>{unit.unit_type}</CTableDataCell>
                  <CTableDataCell>{unit.unit_number}</CTableDataCell>
                  <CTableDataCell>₱{unit.rent_price}</CTableDataCell>
                  <CTableDataCell>₱{unit.deposit_price}</CTableDataCell>
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
