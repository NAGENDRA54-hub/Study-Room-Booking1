import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-grid">
      <div className="hero-card hero-card--alt">
        <p className="eyebrow">New account</p>
        <h2>Create your study booking workspace.</h2>
        <p>Students can reserve rooms instantly, and admins can approve bookings and manage room inventory.</p>
      </div>

      <form className="panel auth-form" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Register</p>
            <h3>Join the SBS platform</h3>
          </div>
        </div>

        <label className="field">
          <span>Full name</span>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" name="password" value={form.password} minLength="6" onChange={handleChange} required />
        </label>

        {error && <p className="notice notice--error">{error}</p>}

        <button type="submit" className="button-link auth-form__submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="auth-form__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  )
}

export default RegisterPage
