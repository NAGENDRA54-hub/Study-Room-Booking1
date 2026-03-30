import { useEffect, useState } from 'react'
import { adminApi, bookingApi, roomApi } from '../api/sbsApi.js'
import { formatCurrency, formatDateTime } from '../utils/formatters.js'

const emptyRoomForm = {
  name: '',
  capacity: 1,
  location: '',
  pricePerHour: 0,
  amenities: '',
  status: 'AVAILABLE',
}

function AdminPanelPage() {
  const [summary, setSummary] = useState(null)
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [roomForm, setRoomForm] = useState(emptyRoomForm)
  const [editingRoomId, setEditingRoomId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [summaryResponse, roomsResponse, bookingsResponse] = await Promise.all([
        adminApi.getSummary(),
        roomApi.getRooms(),
        bookingApi.getBookings(),
      ])

      setSummary(summaryResponse.data)
      setRooms(roomsResponse.data)
      setBookings(bookingsResponse.data)
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to load admin data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRoomChange = (event) => {
    const { name, value } = event.target
    setRoomForm((current) => ({
      ...current,
      [name]: name === 'capacity' || name === 'pricePerHour' ? Number(value) : value,
    }))
  }

  const submitRoom = async (event) => {
    event.preventDefault()
    setError('')

    try {
      if (editingRoomId) {
        await roomApi.updateRoom(editingRoomId, roomForm)
      } else {
        await roomApi.createRoom(roomForm)
      }

      setRoomForm(emptyRoomForm)
      setEditingRoomId(null)
      await loadData()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to save room details.')
    }
  }

  const startEditRoom = (room) => {
    setEditingRoomId(room.id)
    setRoomForm({
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      pricePerHour: Number(room.pricePerHour),
      amenities: room.amenities ?? '',
      status: room.status,
    })
  }

  const removeRoom = async (roomId) => {
    try {
      await roomApi.deleteRoom(roomId)
      await loadData()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to delete room.')
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingApi.updateStatus(bookingId, status)
      await loadData()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to update booking status.')
    }
  }

  return (
    <section className="stack-lg">
      <div className="page-banner">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Control rooms, bookings, and utilization</h2>
          <p>Approve pending reservations, manage the room catalog, and track platform-level activity.</p>
        </div>
      </div>

      {error && <div className="panel notice notice--error">{error}</div>}
      {loading && <div className="panel">Loading admin panel...</div>}

      {!loading && summary && (
        <>
          <div className="stats-grid">
            <div className="panel stat-card">
              <span>Total users</span>
              <strong>{summary.totalUsers}</strong>
            </div>
            <div className="panel stat-card">
              <span>Total rooms</span>
              <strong>{summary.totalRooms}</strong>
            </div>
            <div className="panel stat-card">
              <span>Pending bookings</span>
              <strong>{summary.pendingBookings}</strong>
            </div>
            <div className="panel stat-card">
              <span>Confirmed revenue</span>
              <strong>{formatCurrency(summary.confirmedRevenue)}</strong>
            </div>
          </div>

          <div className="admin-grid">
            <form className="panel" onSubmit={submitRoom}>
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Rooms</p>
                  <h3>{editingRoomId ? 'Edit room' : 'Add a new room'}</h3>
                </div>
              </div>

              <label className="field">
                <span>Name</span>
                <input name="name" value={roomForm.name} onChange={handleRoomChange} required />
              </label>
              <label className="field">
                <span>Capacity</span>
                <input type="number" min="1" name="capacity" value={roomForm.capacity} onChange={handleRoomChange} required />
              </label>
              <label className="field">
                <span>Location</span>
                <input name="location" value={roomForm.location} onChange={handleRoomChange} required />
              </label>
              <label className="field">
                <span>Price per hour</span>
                <input type="number" min="0" step="0.01" name="pricePerHour" value={roomForm.pricePerHour} onChange={handleRoomChange} required />
              </label>
              <label className="field">
                <span>Amenities</span>
                <textarea name="amenities" rows="3" value={roomForm.amenities} onChange={handleRoomChange} />
              </label>
              <label className="field">
                <span>Status</span>
                <select name="status" value={roomForm.status} onChange={handleRoomChange}>
                  <option value="AVAILABLE">Available</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>

              <div className="inline-actions">
                <button type="submit" className="button-link">
                  {editingRoomId ? 'Update room' : 'Create room'}
                </button>
                {editingRoomId && (
                  <button
                    type="button"
                    className="button-link button-link--ghost"
                    onClick={() => {
                      setRoomForm(emptyRoomForm)
                      setEditingRoomId(null)
                    }}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>

            <div className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Inventory</p>
                  <h3>Current rooms</h3>
                </div>
              </div>
              <div className="stack-md">
                {rooms.map((room) => (
                  <article key={room.id} className="list-card">
                    <div>
                      <strong>{room.name}</strong>
                      <p>{room.location}</p>
                    </div>
                    <div className="inline-actions">
                      <button type="button" className="button-link button-link--ghost" onClick={() => startEditRoom(room)}>
                        Edit
                      </button>
                      <button type="button" className="button-link button-link--ghost danger" onClick={() => removeRoom(room.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Approvals</p>
                <h3>Booking requests</h3>
              </div>
            </div>

            <div className="stack-md">
              {bookings.map((booking) => (
                <article key={booking.id} className="list-card list-card--booking">
                  <div>
                    <strong>{booking.roomName}</strong>
                    <p>
                      {booking.userName} ({booking.userEmail})
                    </p>
                    <p>
                      {formatDateTime(booking.startTime)} to {formatDateTime(booking.endTime)}
                    </p>
                  </div>

                  <div className="inline-actions">
                    <span className={`status-pill status-pill--${booking.status.toLowerCase()}`}>{booking.status}</span>
                    {booking.status === 'PENDING' && (
                      <>
                        <button type="button" className="button-link button-link--ghost" onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}>
                          Approve
                        </button>
                        <button type="button" className="button-link button-link--ghost danger" onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}>
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default AdminPanelPage
