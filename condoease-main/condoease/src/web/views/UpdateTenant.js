import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
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
const debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
const UpdateTenant = () => {
  const { tenantId } = useParams()
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    lastName: '',
    firstName: '',
    email: '',
    contactNumber: '',
    address: {
      street: '',
      barangay: '',
      city: '',
      province: '',
    },
    idType: '',
    idNumber: '',
    idDocument: null,
    occupationStatus: '',
    occupationPlace: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const API_URL = import.meta.env.VITE_APP_API_URL

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tenants/${tenantId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.detail || 'Failed to fetch tenant')
        }

        const tenant = await res.json()
        setFormValues({
          lastName: tenant.last_name,
          firstName: tenant.first_name,
          email: tenant.email,
          contactNumber: tenant.contact_number,
          address: {
            street: tenant.street,
            barangay: tenant.barangay,
            city: tenant.city,
            province: tenant.province,
          },
          idType: tenant.id_type,
          idNumber: tenant.id_number,
          idDocument: null,
          occupationStatus: tenant.occupation_status,
          occupationPlace: tenant.occupation_place,
          emergencyContactName: tenant.emergency_contact_name,
          emergencyContactNumber: tenant.emergency_contact_number,
        })
      } catch (err) {
        setErrorMessage(err.message)
      }
    }

    fetchTenant()
  }, [tenantId, API_URL])

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormValues((prev) => ({ ...prev, idDocument: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const formData = new FormData()
    Object.entries({
      lastName: formValues.lastName,
      firstName: formValues.firstName,
      email: formValues.email,
      contactNumber: formValues.contactNumber,
      street: formValues.address.street,
      barangay: formValues.address.barangay,
      city: formValues.address.city,
      province: formValues.address.province,
      idType: formValues.idType,
      idNumber: formValues.idNumber,
      occupationStatus: formValues.occupationStatus,
      occupationPlace: formValues.occupationPlace,
      emergencyContactName: formValues.emergencyContactName,
      emergencyContactNumber: formValues.emergencyContactNumber,
    }).forEach(([k, v]) => formData.append(k, v))

    if (formValues.idDocument) {
      formData.append('idDocument', formValues.idDocument)
    }

    try {
      const res = await fetch(`${API_URL}/api/tenants/${tenantId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      })

      onSuccess?.()
      navigate('/tenantlist')

      const result = await res.json()
      if (!res.ok) throw new Error(result.detail || 'Update failed')

      alert('Tenant updated successfully')
    } catch (err) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CContainer className="mt-5">
      <h4 className="mb-4">Update Tenant Information</h4>
      <CCard>
        <CCardHeader className="text-body-secondary">
          <strong>Tenant Information</strong>
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
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
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
                <small className="text-muted">Accepted formats: jpg, png, pdf.</small>
              </CCol>
            </CRow>

            {/* Occupation */}
            <strong className="mb-3">Place of Work / School</strong>
            <CRow className="mb-3">
              <CCol md={6}>
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
            <strong className="mb-3">Emergency Contact</strong>
            <CRow className="mb-3">
              <CCol md={6}>
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
                  'Update Tenant'
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default UpdateTenant
