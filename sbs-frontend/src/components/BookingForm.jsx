import { useMemo, useState } from 'react'
import { bookingApi, roomApi } from '../api/sbsApi.js'
import { formatCurrency, toDateTimeLocalInput } from '../utils/formatters.js'

function BookingForm({ room, onBookingCreated }) {
  const defaultStart = useMemo(() => {
    const start = new Date()
    start.setMinutes(0, 0, 0)
    start.setHours(start.getHours() + 1)
    return start
  }, [])

  const defaultEnd = useMemo(() => {
    const end = new Date(defaultStart)
    end.setHours(end.getHours() + 2)
    return end
  }, [defaultStart])

  const [form, setForm] = useState({
    startTime: toDateTimeLocalInput(defaultStart),
    endTime: toDateTimeLocalInput(defaultEnd),
  })
  const [availability, setAvailability] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(false)

  const durationHours = useMemo(() => {
    const start = new Date(form.startTime)
    const end = new Date(form.endTime)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return Number.isFinite(diff) && diff > 0 ? diff : 0
  }, [form.endTime, form.startTime])

  const estimatedCost = room ? Number(room.pricePerHour) * durationHours : 0

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setAvailability(null)
    setError('')
    setSuccess('')
  }

  const checkAvailability = async () => {
    setChecking(true)
    setError('')
    setSuccess('')

    try {
      const { data } = await roomApi.checkAvailability(room.id, form.startTime, form.endTime)
      setAvailability(data.available)
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to check availability right now.')
    } finally {
      setChecking(false)
    }
  }

  const submitBooking = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await bookingApi.createBooking({
        roomId: room.id,
        startTime: form.startTime,
        endTime: form.endTime,
      })
      setSuccess('Booking created and waiting for confirmation.')
      setAvailability(true)
      onBookingCreated?.()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Booking could not be created.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="panel booking-form" onSubmit={submitBooking}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Booking</p>
          <h3>Reserve this room</h3>
        </div>
        <p className="panel-heading__meta">Estimated total: {formatCurrency(estimatedCost)}</p>
      </div>

      <label className="field">
        <span>Start time</span>
        <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />
      </label>

      <label className="field">
        <span>End time</span>
        <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required />
      </label>

      <div className="inline-actions">
        <button type="button" className="button-link button-link--ghost" onClick={checkAvailability} disabled={checking}>
          {checking ? 'Checking...' : 'Check availability'}
        </button>
        <button type="submit" className="button-link" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Book room'}
        </button>
      </div>

      {availability !== null && (
        <p className={`notice ${availability ? 'notice--success' : 'notice--warning'}`}>
          {availability ? 'The room is available for the selected time.' : 'That slot is already taken.'}
        </p>
      )}
      {error && <p className="notice notice--error">{error}</p>}
      {success && <p className="notice notice--success">{success}</p>}
    </form>
  )
}

export default BookingForm
