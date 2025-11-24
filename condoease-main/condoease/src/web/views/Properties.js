import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
  CSpinner,
} from '@coreui/react'

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
const debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
const Properties = () => {
  const API_URL = import.meta.env.VITE_APP_API_URL
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [registeredOwners, setRegisteredOwners] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [formValues, setFormValues] = useState({
    propertyName: '',
    registeredOwner: '',
    areaMeasurement: '',
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
    selectedFeatures: [],
    propertyImages: [],
  })

  useEffect(() => {
    const fetchRegisteredOwners = async () => {
      try {
        const res = await fetch(`${API_URL}/api/property-owners`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        })
        if (!res.ok) throw new Error('Failed to fetch registered owners')
        const data = await res.json()
        setRegisteredOwners(data)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    fetchRegisteredOwners()
  }, [API_URL])

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const NOMINATIM_URL = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=ph`
    try {
      const res = await fetch(NOMINATIM_URL, {
        headers: { 'User-Agent': 'CondoEase/1.0 (support@condoease.me)' },
      })
      if (!res.ok) throw new Error('Failed to fetch Nominatim suggestions')
      const data = await res.json()
      const philippineResults = data.filter(
        (item) =>
          item.address &&
          (item.address.country_code === 'ph' || item.address.country === 'Philippines'),
      )
      setSuggestions(philippineResults)
      setShowSuggestions(true)
    } catch (err) {
      console.error('Nominatim Geocoding error:', err)
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [])

  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 500),
    [fetchSuggestions],
  )
  const parseNominatimAddress = (suggestion) => {
    const address = suggestion.address || {}
    const street =
      address.road ||
      address.street ||
      address.pedestrian ||
      address.primary ||
      address.secondary ||
      address.tertiary ||
      ''
    const barangay =
      address.barangay || address.suburb || address.neighbourhood || address.village || ''
    const city = address.city || address.town || address.municipality || address.county || ''
    const province = address.state || address.province || address.region || ''
    return {
      street: street,
      barangay: barangay,
      city: city,
      province: province,
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setFormValues((prev) => ({ ...prev, locationSearch: suggestion.display_name }))
    setSuggestions([])
    setShowSuggestions(false)
    const parsedAddress = parseNominatimAddress(suggestion)
    setFormValues((prev) => ({
      ...prev,
      address: {
        street: parsedAddress.street,
        barangay: parsedAddress.barangay,
        city: parsedAddress.city,
        province: parsedAddress.province,
      },
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    if (name === 'locationSearch') {
      debouncedFetchSuggestions(value)
    }
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
    setLoading(true)
    setErrorMessage(null)
    const missing = []
    if (!formValues.propertyName.trim()) missing.push('Property Name is required.')
    if (!formValues.registeredOwner) missing.push('Registered Owner is required.')
    if (!formValues.areaMeasurement) missing.push('Area Measurement is required.')
    if (!formValues.description.trim()) missing.push('Property Description is required.')
    if (!formValues.locationSearch.trim()) missing.push('Search Location is required.')
    if (!formValues.address.street.trim()) missing.push('Street is required.')
    if (!formValues.address.barangay.trim()) missing.push('Barangay is required.')
    if (!formValues.address.city.trim()) missing.push('City is required.')
    if (!formValues.address.province.trim()) missing.push('Province is required.')
    if (!formValues.propertyNotes.trim()) missing.push('Property Notes are required.')
    if (!formValues.units || formValues.units <= 0)
      missing.push('Number of Units/Rooms is required.')
    if (missing.length > 0) {
      setErrorMessage(missing.join('\n'))
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('propertyName', formValues.propertyName)
    formData.append('registeredOwner', formValues.registeredOwner)
    formData.append('areaMeasurement', formValues.areaMeasurement)
    formData.append('description', formValues.description)
    formData.append('street', formValues.address.street)
    formData.append('barangay', formValues.address.barangay)
    formData.append('city', formValues.address.city)
    formData.append('province', formValues.address.province)
    formData.append('propertyNotes', formValues.propertyNotes)
    formData.append('units', formValues.units)
    formData.append('selectedFeatures', formValues.selectedFeatures.join(','))
    formValues.propertyImages.forEach((file) => formData.append('propertyImages', file))

    // Object.keys(formValues).forEach((key) => {
    //   if (key === 'address') {
    //     Object.keys(formValues.address).forEach((subKey) => {
    //       formData.append(`address[${subKey}]`, formValues.address[subKey])
    //     })
    //   } else if (key === 'propertyImages') {
    //     formValues.propertyImages.forEach((file) => formData.append('propertyImages', file))
    //   } else {
    //     formData.append(key, formValues[key])
    //   }
    // })

    try {
      const res = await fetch(`${API_URL}/api/properties`, {
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
        registeredOwner: '',
        areaMeasurement: '',
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
        selectedFeatures: [],
        propertyImages: [],
      })
    } catch (err) {
      console.error('Error submitting property:', err)
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getTabStyles = (index) => ({
    backgroundColor: activeTab === index ? '#1D2B57' : 'transparent',
    color: activeTab === index ? '#fff' : '#000',
  })

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Register New Property</h4>
      <strong className="text-body-secondary">
        Fill all required details in all tabs to successfully register a new property.
      </strong>
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
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <CForm onSubmit={handleSubmit}>
            <CTabContent>
              {/* Basic Details */}
              <CTabPane visible={activeTab === 0}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>Property Name</strong>
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
                    <strong>Area Measurement (sqm)</strong>
                    <CFormInput
                      type="number"
                      name="areaMeasurement"
                      placeholder="Area Measurement (sqm)"
                      value={formValues.areaMeasurement}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormSelect
                      name="registeredOwner"
                      value={formValues.registeredOwner}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Registered Property Owner</option>
                      {registeredOwners.map((registeredOwner) => (
                        <option key={registeredOwner.owner_id} value={registeredOwner.owner_id}>
                          {registeredOwner.first_name} {registeredOwner.last_name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <strong>Property Description</strong>
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
                  <CCol md={12} style={{ position: 'relative' }}>
                    <strong>Search Location</strong>
                    <CFormInput
                      type="text"
                      name="locationSearch"
                      placeholder="Search Location (e.g., Ayala Avenue, Makati)"
                      value={formValues.locationSearch}
                      onChange={handleInputChange}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true)
                      }}
                      required
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <ul
                        style={{
                          position: 'absolute',
                          zIndex: 1000,
                          width: '100%',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          border: '1px solid #ccc',
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          backgroundColor: 'white',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          top: '100%',
                        }}
                      >
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                              padding: '10px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = '#f0f0f0')
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                          >
                            {suggestion.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>Street</strong>
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
                    <strong>Barangay</strong>
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
                    <strong>City</strong>
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
                    <strong>Province</strong>
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
                    <strong>Property Description / Notes</strong>
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
                  <CCol md={12}>
                    <strong>Number of Units/Rooms</strong>
                    <CFormInput
                      type="number"
                      name="units"
                      placeholder="Number of Units/Rooms"
                      value={formValues.units}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <strong className="mb-2">Check All Features & Amenities in this Property</strong>
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
                <small className="text-muted">
                  Upload up to 5 images. Maximum file size: 5MB. Accepted formats: jpg, png, gif.
                </small>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="file"
                      name="propertyImages"
                      multiple
                      onChange={handleImageUpload}
                      accept=".jpg,.png,.gif"
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
                    />
                  </CCol>
                </CRow>
              </CTabPane>
            </CTabContent>

            {/* Submit Button */}
            <div className="d-flex justify-content-end mt-4">
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
                  'Add Property'
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Properties
