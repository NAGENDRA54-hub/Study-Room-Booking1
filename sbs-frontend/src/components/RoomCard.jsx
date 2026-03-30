import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatters.js'

function RoomCard({ room }) {
  return (
    <article className="room-card">
      <div className="room-card__header">
        <div>
          <p className="eyebrow">Room</p>
          <h3>{room.name}</h3>
        </div>
        <span className={`status-pill status-pill--${room.status.toLowerCase()}`}>{room.status}</span>
      </div>

      <p className="room-card__location">{room.location}</p>
      <p className="room-card__meta">
        Capacity: <strong>{room.capacity}</strong>
      </p>
      <p className="room-card__meta">
        Rate: <strong>{formatCurrency(room.pricePerHour)}</strong> / hour
      </p>
      <p className="room-card__amenities">{room.amenities || 'Quiet seating, reliable Wi-Fi, and flexible setup.'}</p>

      <Link to={`/rooms/${room.id}`} className="button-link room-card__action">
        View details
      </Link>
    </article>
  )
}

export default RoomCard
