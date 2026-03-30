import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BookingForm from '../components/BookingForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { roomApi } from '../api/sbsApi.js'
import { formatCurrency } from '../utils/formatters.js'

function RoomDetailsPage() {
  const { roomId } = useParams()
  const { isAuthenticated } = useAuth()
  const [room, setRoom] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const { data } = await roomApi.getRoom(roomId)
        setRoom(data)
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Unable to load this room.')
      } finally {
        setLoading(false)
      }
    }

    loadRoom()
  }, [roomId])

  if (loading) {
    return <div className="panel">Loading room details...</div>
  }

  if (error) {
    return <div className="panel notice notice--error">{error}</div>
  }

  return (
    <section className="details-grid">
      <article className="panel room-detail-panel">
        <p className="eyebrow">Room details</p>
        <h2>{room.name}</h2>
        <div className="detail-list">
          <div>
            <span>Status</span>
            <strong>{room.status}</strong>
          </div>
          <div>
            <span>Capacity</span>
            <strong>{room.capacity} people</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{room.location}</strong>
          </div>
          <div>
            <span>Price</span>
            <strong>{formatCurrency(room.pricePerHour)} / hour</strong>
          </div>
        </div>

        <div className="feature-box">
          <h3>Amenities</h3>
          <p>{room.amenities || 'Whiteboard, charging outlets, Wi-Fi, and quiet environment.'}</p>
        </div>
      </article>

      {isAuthenticated ? (
        <BookingForm room={room} />
      ) : (
        <div className="panel">
          <p className="eyebrow">Booking required</p>
          <h3>Sign in to reserve this room</h3>
          <p>You can explore rooms without an account, but creating bookings requires authentication.</p>
          <Link to="/login" className="button-link">
            Login to continue
          </Link>
        </div>
      )}
    </section>
  )
}

export default RoomDetailsPage
