import { useEffect, useState } from 'react'
import { bookingApi } from '../api/sbsApi.js'
import { formatCurrency, formatDateTime } from '../utils/formatters.js'

function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBookings = async () => {
    try {
      const { data } = await bookingApi.getBookings()
      setBookings(data)
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const cancelBooking = async (bookingId) => {
    try {
      await bookingApi.cancelBooking(bookingId)
      await loadBookings()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to cancel the booking.')
    }
  }

  return (
    <section className="stack-lg">
      <div className="page-banner">
        <div>
          <p className="eyebrow">Bookings</p>
          <h2>Track and manage your reservations</h2>
          <p>See approval status, monitor timing, and cancel bookings you no longer need.</p>
        </div>
      </div>

      {loading && <div className="panel">Loading your bookings...</div>}
      {error && <div className="panel notice notice--error">{error}</div>}

      {!loading && (
        <div className="stack-md">
          {bookings.map((booking) => (
            <article key={booking.id} className="panel booking-card">
              <div className="booking-card__header">
                <div>
                  <p className="eyebrow">Booking #{booking.id}</p>
                  <h3>{booking.roomName}</h3>
                </div>
                <span className={`status-pill status-pill--${booking.status.toLowerCase()}`}>{booking.status}</span>
              </div>

              <div className="detail-list detail-list--two">
                <div>
                  <span>Location</span>
                  <strong>{booking.roomLocation}</strong>
                </div>
                <div>
                  <span>Start</span>
                  <strong>{formatDateTime(booking.startTime)}</strong>
                </div>
                <div>
                  <span>End</span>
                  <strong>{formatDateTime(booking.endTime)}</strong>
                </div>
                <div>
                  <span>Total price</span>
                  <strong>{formatCurrency(booking.totalPrice)}</strong>
                </div>
              </div>

              {booking.status !== 'CANCELLED' && (
                <div className="inline-actions">
                  <button type="button" className="button-link button-link--ghost" onClick={() => cancelBooking(booking.id)}>
                    Cancel booking
                  </button>
                </div>
              )}
            </article>
          ))}

          {bookings.length === 0 && <div className="panel">You do not have any bookings yet.</div>}
        </div>
      )}
    </section>
  )
}

export default MyBookingsPage
