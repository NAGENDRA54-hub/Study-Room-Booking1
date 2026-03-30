import { useEffect, useState } from 'react'
import RoomCard from '../components/RoomCard.jsx'
import { roomApi } from '../api/sbsApi.js'

function DashboardPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const { data } = await roomApi.getRooms()
        setRooms(data)
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Unable to load rooms right now.')
      } finally {
        setLoading(false)
      }
    }

    loadRooms()
  }, [])

  return (
    <section className="stack-lg">
      <div className="page-banner">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Live study room availability</h2>
          <p>Browse open spaces, compare amenities, and open a room to reserve your preferred slot.</p>
        </div>
      </div>

      {loading && <div className="panel">Loading rooms...</div>}
      {error && <div className="panel notice notice--error">{error}</div>}

      {!loading && !error && (
        <div className="room-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
          {rooms.length === 0 && <div className="panel">No rooms have been added yet.</div>}
        </div>
      )}
    </section>
  )
}

export default DashboardPage
