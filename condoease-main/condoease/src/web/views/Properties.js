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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'

const propertyTypes = ['Apartment', 'Condo', 'House', 'Townhouse', 'Studio']
const features = [
  'Air Conditioned',
  'Car Parking',
  'Laundry Room',
  'Balcony',
  'Gym',
  'Internet',
  'Garden',
  'Swimming Pool',
  'Pets Allowed',
]

const Properties = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [formValues, setFormValues] = useState({
    propertyName: '',
    rentPrice: '',
    // propertyType: '',
    registeredOwner: '',
    areaMeasurement: '',
    commissionPercentage: '',
    depositPrice: '',
    description: '',
    locationSearch: '',
    address: {
      street: '',
      barangay: '',
      city: '',
      province: '',
    },
    propertyNotes: '',
    units: 0,
    bedrooms: 0,
    bathrooms: 0,
    selectedFeatures: [],
    propertyImages: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }))
  }

  const handleFeatureChange = (feature) => {
    setFormValues((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter((f) => f !== feature)
        : [...prev.selectedFeatures, feature],
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      alert('You can upload a maximum of 5 images.')
      return
    }
    const validFiles = files.filter(
      (file) =>
        file.size <= 5 * 1024 * 1024 &&
        ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
    )
    if (validFiles.length !== files.length) {
      alert('Some files are invalid. Only jpg, png, and gif files under 5MB are accepted.')
    }
    setFormValues((prev) => ({ ...prev, propertyImages: validFiles }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    Object.keys(formValues).forEach((key) => {
      if (key === 'address') {
        Object.keys(formValues.address).forEach((subKey) => {
          formData.append(`address[${subKey}]`, formValues.address[subKey])
        })
      } else if (key === 'propertyImages') {
        formValues.propertyImages.forEach((file) => formData.append('propertyImages', file))
      } else {
        formData.append(key, formValues[key])
      }
    })

    try {
      const res = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!res.ok) throw new Error(await res.text())

      alert('Property added successfully!')
      setFormValues({
        propertyName: '',
        rentPrice: '',
        // propertyType: '',
        registeredOwner: '',
        areaMeasurement: '',
        commissionPercentage: '',
        depositPrice: '',
        description: '',
        locationSearch: '',
        address: {
          street: '',
          barangay: '',
          city: '',
          province: '',
        },
        propertyNotes: '',
        units: 0,
        bedrooms: 0,
        bathrooms: 0,
        selectedFeatures: [],
        propertyImages: [],
      })
    } catch (err) {
      console.error(err)
      alert('Error adding property.')
    }
  }

  const getTabStyles = (index) => ({
    backgroundColor: activeTab === index ? '#1D2B57' : 'transparent',
    color: activeTab === index ? '#fff' : '#000',
  })

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Register New Property</h4>
      <span className="text-body-secondary">
        FILL ALL REQUIRED DETAILS IN ALL TABS TO SUCCESSFULLY REGISTER A NEW PROPERTY.
      </span>
      <CCard>
        <CCardHeader>
          <CNav variant="tabs" className="d-flex justify-content-between w-100">
            <CNavItem className="flex-fill text-center">
              <CNavLink
                className="w-100 fw-bold"
                active={activeTab === 0}
                onClick={() => setActiveTab(0)}
                style={getTabStyles(0)}
              >
                BASIC DETAILS
              </CNavLink>
            </CNavItem>
            <CNavItem className="flex-fill text-center">
              <CNavLink
                className="w-100 fw-bold"
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
                style={getTabStyles(1)}
              >
                LOCATION
              </CNavLink>
            </CNavItem>
            <CNavItem className="flex-fill text-center">
              <CNavLink
                className="w-100 fw-bold"
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
                style={getTabStyles(2)}
              >
                FEATURES & AMENITIES
              </CNavLink>
            </CNavItem>
            <CNavItem className="flex-fill text-center">
              <CNavLink
                className="w-100 fw-bold"
                active={activeTab === 3}
                onClick={() => setActiveTab(3)}
                style={getTabStyles(3)}
              >
                PROPERTY IMAGES
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CTabContent>
              {/* Basic Details */}
              <CTabPane visible={activeTab === 0}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="propertyName"
                      placeholder="Property Name"
                      value={formValues.propertyName}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
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
                </CRow>
                {/* <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="registeredOwner"
                      placeholder="Registered Property Owner"
                      value={formValues.registeredOwner}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                </CRow> */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="registeredOwner"
                      placeholder="Registered Property Owner"
                      value={formValues.registeredOwner}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      name="areaMeasurement"
                      placeholder="Area Measurement (sqm)"
                      value={formValues.areaMeasurement}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      name="commissionPercentage"
                      placeholder="Agency Commission (%)"
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
                      name="depositPrice"
                      placeholder="Deposit Price (₱)"
                      value={formValues.depositPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormTextarea
                      name="description"
                      placeholder="Property Description"
                      rows="3"
                      value={formValues.description}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                </CRow>
              </CTabPane>

              {/* Location */}
              <CTabPane visible={activeTab === 1}>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="text"
                      name="locationSearch"
                      placeholder="Search Location"
                      value={formValues.locationSearch}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="street"
                      placeholder="Street"
                      value={formValues.address.street}
                      onChange={handleAddressChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="barangay"
                      placeholder="Barangay"
                      value={formValues.address.barangay}
                      onChange={handleAddressChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formValues.address.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="province"
                      placeholder="Province"
                      value={formValues.address.province}
                      onChange={handleAddressChange}
                      required
                    />
                  </CCol>
                </CRow>
              </CTabPane>

              {/* Features & Amenities */}
              <CTabPane visible={activeTab === 2}>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormTextarea
                      name="propertyNotes"
                      placeholder="Property Notes"
                      rows="3"
                      value={formValues.propertyNotes}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormInput
                      type="number"
                      name="units"
                      placeholder="Number of Units/Rooms"
                      value={formValues.units}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormInput
                      type="number"
                      name="bedrooms"
                      placeholder="Number of Bedrooms"
                      value={formValues.bedrooms}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormInput
                      type="number"
                      name="bathrooms"
                      placeholder="Number of Bathrooms"
                      value={formValues.bathrooms}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  {features.map((feature, idx) => (
                    <CCol md={4} key={idx}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`feature-${idx}`}
                          checked={formValues.selectedFeatures.includes(feature)}
                          onChange={() => handleFeatureChange(feature)}
                        />
                        <label className="form-check-label" htmlFor={`feature-${idx}`}>
                          {feature}
                        </label>
                      </div>
                    </CCol>
                  ))}
                </CRow>
              </CTabPane>

              {/* Property Images */}
              <CTabPane visible={activeTab === 3}>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="file"
                      name="propertyImages"
                      multiple
                      onChange={handleImageUpload}
                      accept=".jpg,.png,.gif"
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="file"
                      name="propertyImages"
                      multiple
                      onChange={handleImageUpload}
                      accept=".jpg,.png,.gif"
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="file"
                      name="propertyImages"
                      multiple
                      onChange={handleImageUpload}
                      accept=".jpg,.png,.gif"
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="file"
                      name="propertyImages"
                      multiple
                      onChange={handleImageUpload}
                      accept=".jpg,.png,.gif"
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="file"
                      name="propertyImages"
                      multiple
                      onChange={handleImageUpload}
                      accept=".jpg,.png,.gif"
                      required
                    />
                  </CCol>
                </CRow>
                <small className="text-muted">
                  Upload up to 5 images. Maximum file size: 5MB. Accepted formats: jpg, png, gif.
                </small>
              </CTabPane>
            </CTabContent>

            {/* Submit Button */}
            <div className="d-flex justify-content-end mt-4">
              <CButton
                type="submit"
                style={{ backgroundColor: '#F28D35', color: 'white', fontWeight: 'bold' }}
              >
                Add Property
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Properties
