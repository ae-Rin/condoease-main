import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CButton,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CInputGroup,
  CInputGroupText,
  CSpinner,
} from '@coreui/react'
import { FaEye } from 'react-icons/fa'
import logoWhite from 'src/assets/images/logo_white.png'

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
const bankAssociates = [
  'BDO Unibank, Inc.',
  'Land Bank of the Philippines (LandBank)',
  'Bank of the Philippine Islands (BPI)',
  'Metropolitan Bank & Trust Company (Metrobank)',
  'China Banking Corporation (China Bank)',
  'Rizal Commercial Banking Corporation (RCBC)',
  'Security Bank Corporation',
  'Philippine National Bank (PNB)',
  'Development Bank of the Philippines (DBP)',
  'Union Bank of the Philippines, Inc. (UnionBank)',
  'Asia United Bank Corporation (AUB)',
  'Bank of Commerce (BankCom)',
  'CTBC Bank (Philippines) Corporation',
  'East West Banking Corporation (EastWest Bank)',
  'Maybank Philippines, Inc.',
  'Philippine Bank of Communications (PBCom)',
  'Philippine Trust Company (Philtrust Bank)',
  'Philippine Veterans Bank',
  'Al-Amanah Islamic Investment Bank of the Philippines (Government)',
  'Overseas Filipino Bank (OFBank)',
  'Citibank, N.A.',
  'The Hongkong and Shanghai Banking Corporation (HSBC)',
  'Standard Chartered Bank',
  'Deutsche Bank AG',
  'MUFG Bank, Ltd.',
  'Mizuho Bank, Ltd.',
  'JPMorgan Chase Bank, N.A.',
  'CIMB Bank Philippines Inc.',
  'ING Bank N.V.',
  'Philippine Savings Bank (PSBank)',
  'China Bank Savings, Inc. (CBS)',
  'City Savings Bank, Inc.',
  'Philippine Business Bank, Inc.',
  'Sterling Bank of Asia, Inc.',
  'BPI Direct BanKo, Inc.',
  'UCPB Savings Bank',
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
const RegisterStep2 = () => {
  const API_URL = import.meta.env.VITE_APP_API_URL
  const location = useLocation()
  const navigate = useNavigate()
  const emailFromState = location.state?.email || ''
  const [email, setEmail] = useState(emailFromState)
  const roleFromState = location.state?.role || 'tenant'
  const [role, setRole] = useState(roleFromState)
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rePassword: '',
    role: '',
    contactNumber: '',
    locationSearch: '',
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
    bankAssociated: '',
    bankAccountNumber: '',
  })

  useEffect(() => {
    if (role !== 'owner') {
      setFormValues((prev) => ({
        ...prev,
        bankAssociated: '',
        bankAccountNumber: '',
      }))
    }
  }, [role])

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{8,}$/
  //   if (formValues.password !== formValues.rePassword) {
  //     alert('Passwords do not match!')
  //     return
  //   }
  //   if (!passwordRegex.test(formValues.password)) {
  //     alert(
  //       'Password must be at least 8 characters and include a combination of letters, numbers, and special characters (!$@%).',
  //     )
  //     return
  //   }
  //   try {
  //     const res = await fetch(`${API_URL}/api/registerstep2`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         firstName: formValues.firstName,
  //         lastName: formValues.lastName,
  //         email: email,
  //         password: formValues.password,
  //         role: role,
  //       }),
  //     })
  //     const data = await res.json()
  //     if (res.ok && data.success) {
  //       alert('Registration successful!')
  //       navigate('/login')
  //     } else {
  //       alert(data.error || 'Registration failed.')
  //     }
  //   } catch (err) {
  //     alert('Server error. Please try again later.')
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    if (formValues.password !== formValues.rePassword) {
      alert('Passwords do not match!')
      setLoading(false)
      return
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{8,}$/
    if (!passwordRegex.test(formValues.password)) {
      alert('Password must contain letters, numbers, and special characters (!$@%).')
      setLoading(false)
      return
    }
    try {
      const formData = new FormData()
      formData.append('firstName', formValues.firstName)
      formData.append('lastName', formValues.lastName)
      formData.append('email', email)
      formData.append('password', formValues.password)
      formData.append('role', role)
      formData.append('contactNumber', formValues.contactNumber)
      formData.append('street', formValues.address.street)
      formData.append('barangay', formValues.address.barangay)
      formData.append('city', formValues.address.city)
      formData.append('province', formValues.address.province)
      formData.append('idType', formValues.idType)
      formData.append('idNumber', formValues.idNumber)
      if (formValues.idDocument) {
        formData.append('idDocument', formValues.idDocument)
      }
      formData.append('occupationStatus', formValues.occupationStatus)
      formData.append('occupationPlace', formValues.occupationPlace)
      formData.append('emergencyContactName', formValues.emergencyContactName)
      formData.append('emergencyContactNumber', formValues.emergencyContactNumber)
      if (role === 'owner') {
        formData.append('bankAssociated', formValues.bankAssociated)
        formData.append('bankAccountNumber', formValues.bankAccountNumber)
      }
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed')
      }
      alert('Registration successful! Please verify your email.')
      navigate('/login')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Top nav bar */}
      <div
        style={{
          background: '#1D2B57',
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 50px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoWhite} alt="CondoEase Logo" style={{ height: 64, marginRight: 12 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          <span style={{ color: 'white', fontSize: 20 }}>Already have an account?</span>
          <CButton
            className="text-white fw-bold px-4"
            style={{ borderRadius: 20, fontSize: 20, backgroundColor: '#F28D35' }}
            onClick={() => navigate('/login')}
          >
            Log in
          </CButton>
        </div>
      </div>

      {/* Main content */}
      <CContainer className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        <CRow className="justify-content-center w-100">
          <CCol xs={12} md={7} lg={5} xl={12}>
            {/* Progress bar */}
            <div
              className="d-flex justify-content-center align-items-center mb-5 mt-3"
              style={{ gap: 0 }}
            >
              <div
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  background: '#F7941D',
                  border: '3px solid #B86C29',
                }}
              />
              <div style={{ flex: 1, height: 2, background: '#B86C29' }} />
              <div
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  background: '#F7941D',
                  border: '3px solid #B86C29',
                }}
              />
              <div style={{ flex: 1, height: 2, background: '#333333' }} />
              <div
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  background: '#6B6B6B',
                  border: '3px solid #333333',
                }}
              />
            </div>
            {/* Title */}
            <div className="text-center mb-3">
              <h2 className="fw-bold mb-4 text-start" style={{ fontSize: 32 }}>
                Create {role === 'owner' ? 'Property Owner' : 'Tenant'} Account
              </h2>
            </div>
            {/* Form */}
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol>
                  <div className="fw-semibold text-start mb-1">First Name</div>
                  <CFormInput
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleInputChange}
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
                  />
                </CCol>
                <CCol>
                  <div className="fw-semibold text-start mb-1">Last Name</div>
                  <CFormInput
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleInputChange}
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <div className="fw-semibold text-start mb-1">Email</div>
                  <CFormInput
                    type="email"
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-3"
                    required
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
                  />
                </CCol>
                <CCol>
                  <div className="fw-semibold text-start mb-1">Contact Number</div>
                  <CFormInput
                    type="number"
                    placeholder="Contact Number"
                    name="contactNumber"
                    value={formValues.contactNumber}
                    onChange={handleInputChange}
                    required
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
                  />
                </CCol>
              </CRow>
              <div className="mb-2 fw-semibold text-start">Enter Password</div>
              <CInputGroup className="mb-3">
                <CFormInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  style={{
                    borderColor: '#A3C49A',
                    borderRadius: 10,
                    fontSize: 16,
                    padding: '10px 10px',
                  }}
                >
                  <CInputGroupText
                    style={{ background: 'transparent', cursor: 'pointer' }}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <FaEye color="#A3C49A" />
                  </CInputGroupText>
                </CFormInput>
                {/* <CInputGroupText
                  style={{ background: 'transparent', cursor: 'pointer' }}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <FaEye color="#A3C49A" />
                </CInputGroupText> */}
              </CInputGroup>
              <div className="mb-2 fw-semibold text-start">Re-Enter Password</div>
              <CInputGroup className="mb-4">
                <CFormInput
                  type={showRePassword ? 'text' : 'password'}
                  placeholder="Re-Enter Password"
                  name="rePassword"
                  value={formValues.rePassword}
                  onChange={handleInputChange}
                  style={{
                    borderColor: '#A3C49A',
                    borderRadius: 10,
                    fontSize: 16,
                    padding: '10px 10px',
                  }}
                />
                <CInputGroupText
                  style={{ background: 'transparent', cursor: 'pointer', borderColor: '#A3C49A' }}
                  onClick={() => setShowRePassword((v) => !v)}
                >
                  <FaEye color="#A3C49A" />
                </CInputGroupText>
              </CInputGroup>
              <small className="text-muted mt-3 text-center">
                Password must be at least 8 characters and include letters, numbers, and special
                characters (!$@%).
              </small>

              <CRow className="mb-3">
                <CCol>
                  <div className="fw-semibold text-start mb-1">Search Location</div>
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
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
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
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
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
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
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
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
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
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect
                    name="idType"
                    value={formValues.idType}
                    onChange={handleInputChange}
                    required
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
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
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <strong>Upload ID Document</strong>
                  <CFormInput
                    type="file"
                    name="idDocument"
                    onChange={handleFileChange}
                    required
                    style={{
                      borderColor: '#A3C49A',
                      borderRadius: 10,
                      fontSize: 16,
                      padding: '10px 10px',
                    }}
                  />
                  <small className="text-muted">Accepted formats: jpg, png, pdf.</small>
                </CCol>
              </CRow>

              {role === 'tenant' && (
                <>
                  <strong className="mb-3">Place of Work / School</strong>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormSelect
                        name="occupationStatus"
                        value={formValues.occupationStatus}
                        onChange={handleInputChange}
                        required
                        style={{
                          borderColor: '#A3C49A',
                          borderRadius: 10,
                          fontSize: 16,
                          padding: '10px 10px',
                        }}
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
                        style={{
                          borderColor: '#A3C49A',
                          borderRadius: 10,
                          fontSize: 16,
                          padding: '10px 10px',
                        }}
                      />
                    </CCol>
                  </CRow>

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
                        style={{
                          borderColor: '#A3C49A',
                          borderRadius: 10,
                          fontSize: 16,
                          padding: '10px 10px',
                        }}
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
                        style={{
                          borderColor: '#A3C49A',
                          borderRadius: 10,
                          fontSize: 16,
                          padding: '10px 10px',
                        }}
                      />
                    </CCol>
                  </CRow>
                </>
              )}

              {role === 'owner' && (
                <>
                  <strong className="mb-3">Bank Information</strong>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormSelect
                        name="bankAssociated"
                        value={formValues.bankAssociated}
                        onChange={handleInputChange}
                        required
                        style={{
                          borderColor: '#A3C49A',
                          borderRadius: 10,
                          fontSize: 16,
                          padding: '10px 10px',
                        }}
                      >
                        <option value="">Select Bank Associated</option>
                        {bankAssociates.map((bank, idx) => (
                          <option key={idx} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>

                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        name="bankAccountNumber"
                        placeholder="Bank Account Number"
                        value={formValues.bankAccountNumber}
                        onChange={handleInputChange}
                        required
                        style={{
                          borderColor: '#A3C49A',
                          borderRadius: 10,
                          fontSize: 16,
                          padding: '10px 10px',
                        }}
                      />
                    </CCol>
                  </CRow>
                </>
              )}

              <div className="d-grid mb-4">
                <CButton
                  className="text-white fw-bold"
                  style={{
                    borderRadius: 50,
                    fontSize: 25,
                    padding: '13px 0',
                    width: '90%',
                    margin: '0 auto',
                    backgroundColor: '#F28D35',
                  }}
                  type="submit"
                >
                  Create Account
                </CButton>
              </div>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default RegisterStep2
