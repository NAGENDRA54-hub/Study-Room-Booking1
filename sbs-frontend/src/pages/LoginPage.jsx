import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
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
      const response = await login(form)
      const redirectTo = location.state?.from?.pathname || (response.role === 'ADMIN' ? '/admin' : '/dashboard')
      navigate(redirectTo, { replace: true })
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed. Check your credentials and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-grid">
      <div className="hero-card">
        <p className="eyebrow">Welcome back</p>
        <h2>Book rooms without booking conflicts.</h2>
        <p>
          Sign in to browse study rooms, reserve time slots, and track your bookings in one place.
        </p>
      </div>

      <form className="panel auth-form" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Login</p>
            <h3>Access your SBS account</h3>
          </div>
        </div>

        <label className="field">
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        {error && <p className="notice notice--error">{error}</p>}

        <button type="submit" className="button-link auth-form__submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>

        <p className="auth-form__footer">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </section>
  )
}

export default LoginPage
