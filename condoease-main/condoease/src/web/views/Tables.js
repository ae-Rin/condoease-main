import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CButton,
  CFormSelect,
  CBadge,
  CAvatar,
} from '@coreui/react'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

const Tables = () => {
  const navigate = useNavigate()
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [buildingFilter, setBuildingFilter] = useState('')
  const [roomTypeFilter, setRoomTypeFilter] = useState('')

  const units = [
    {
      id: 1,
      name: 'Unit 101',
      status: 'Vacant',
      color: 'success',
      building: 'A',
      roomType: 'Studio',
    },
    { id: 2, name: 'Unit 102', status: 'Vacant', color: 'success', building: 'B', roomType: '1BR' },
    {
      id: 3,
      name: 'Unit 103',
      status: 'Occupied',
      color: 'danger',
      building: 'A',
      roomType: '2BR',
    },
  ]

  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (buildingFilter ? unit.building === buildingFilter : true) &&
      (roomTypeFilter ? unit.roomType === roomTypeFilter : true),
  )

  const uniqueBuildings = [...new Set(units.map((u) => u.building))]
  const uniqueRoomTypes = [...new Set(units.map((u) => u.roomType))]

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h4 className="mb-3">Unit Management</h4>
      <div className="mb-3">
        <span
          className="text-body-secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/cards')}
        >
          DASHBOARD
        </span>{' '}
        / <span style={{ color: '#F28D35' }}>UNIT MANAGEMENT</span>
      </div>

      <CRow>
        <CCol md={4}>
          <div className="d-flex mb-3">
            <CFormInput
              placeholder="Search Unit"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
            />
            <CButton style={{ backgroundColor: '#F28D35', color: 'white' }}>
              <CIcon icon={cilPlus} />
            </CButton>
          </div>

          <div className="d-flex gap-2 mb-2">
            <CFormSelect value={buildingFilter} onChange={(e) => setBuildingFilter(e.target.value)}>
              <option value="" disabled hidden>
                Select Building
              </option>
              {uniqueBuildings.map((bldg, i) => (
                <option key={i} value={bldg}>
                  {bldg}
                </option>
              ))}
            </CFormSelect>

            <CFormSelect value={roomTypeFilter} onChange={(e) => setRoomTypeFilter(e.target.value)}>
              <option value="" disabled hidden>
                Select Room Type
              </option>
              {uniqueRoomTypes.map((type, i) => (
                <option key={i} value={type}>
                  {type}
                </option>
              ))}
            </CFormSelect>
          </div>

          <CButton
            style={{ backgroundColor: '#F28D35', color: 'white', fontWeight: 'bold' }}
            className="w-100 mb-3"
          >
            Sort
          </CButton>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredUnits.map((unit) => (
              <CCard
                key={unit.id}
                className={`mb-3 ${selectedUnit?.id === unit.id ? 'border-warning' : 'border-success'}`}
                onClick={() => setSelectedUnit(unit)}
                style={{ cursor: 'pointer' }}
              >
                <CCardBody className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <CAvatar style={{ backgroundColor: '#F28D35' }} className="me-3">
                      U
                    </CAvatar>
                    <div>
                      <strong>{unit.name}</strong>
                      <div className="text-muted small">
                        {unit.building} Building, {unit.roomType}
                      </div>
                    </div>
                  </div>
                  <CBadge color={unit.color}>{unit.status.toUpperCase()}</CBadge>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </CCol>

        <CCol md={8}>
          {selectedUnit ? (
            <CCard className="mb-4 border-warning">
              <CCardHeader>
                <strong>{selectedUnit.name}</strong>
                <div className="text-body-secondary small">
                  {selectedUnit.building} Building - {selectedUnit.roomType}
                </div>
              </CCardHeader>
              <CCardBody>
                <p>
                  <strong>Status:</strong>{' '}
                  <CBadge color={selectedUnit.color}>{selectedUnit.status}</CBadge>
                </p>
                <p>
                  <strong>Additional Details:</strong>
                </p>
                <ul>
                  <li>Floor: 3rd</li>
                  <li>Size: 35 sqm</li>
                  <li>Amenities: Balcony, WiFi</li>
                </ul>
              </CCardBody>
            </CCard>
          ) : (
            <p className="text-muted">Select a unit to view its details.</p>
          )}
        </CCol>
      </CRow>
    </div>
  )
}

export default Tables
