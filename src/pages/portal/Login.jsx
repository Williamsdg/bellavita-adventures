import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Simple auth - in production this would use Supabase auth
    if (email === 'mark@bellavitaadventures.com' && password === 'bellavita2024') {
      localStorage.setItem('bv_authenticated', 'true')
      navigate('/portal/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <span className="brand-name">BellaVita</span>
        <span className="portal-label">Owner Portal</span>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mark@bellavitaadventures.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
