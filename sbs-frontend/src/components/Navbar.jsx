import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <header className="topbar">
      <div className="brand-block">
        <span className="brand-kicker">SBS</span>
        <div>
          <h1>Study Room Booking System</h1>
          <p>Reserve focused spaces with live availability and conflict protection.</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard" className="nav-link">
          Rooms
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/bookings" className="nav-link">
            My Bookings
          </NavLink>
        )}
        {user?.role === 'ADMIN' && (
          <NavLink to="/admin" className="nav-link">
            Admin Panel
          </NavLink>
        )}
        {!isAuthenticated && (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="button-link">
              Register
            </NavLink>
          </>
        )}
        {isAuthenticated && (
          <button type="button" className="button-link button-link--ghost" onClick={logout}>
            Sign out
          </button>
        )}
      </nav>
    </header>
  )
}

export default Navbar
