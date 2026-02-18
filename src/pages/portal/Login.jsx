import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleEnter = () => {
    localStorage.setItem('bv_authenticated', 'true')
    navigate('/portal/dashboard')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <span className="brand-name">BellaVita</span>
        <span className="portal-label">Owner Portal</span>

        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem',
          marginBottom: '28px',
          lineHeight: 1.6,
        }}>
          Welcome back, Mark. Access your client management dashboard below.
        </p>

        <button className="btn-primary" onClick={handleEnter}>
          Enter Portal
        </button>
      </div>
    </div>
  )
}
