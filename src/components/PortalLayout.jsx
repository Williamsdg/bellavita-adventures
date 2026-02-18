import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, Map, LogOut, Globe } from 'lucide-react'

export default function PortalLayout({ title, children }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('bv_authenticated')
    navigate('/portal')
  }

  return (
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-sidebar-header">
          <span className="brand-name">BellaVita</span>
          <span className="portal-label">Owner Portal</span>
        </div>

        <ul className="portal-nav">
          <li>
            <NavLink to="/portal/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/portal/clients" className={({ isActive }) => isActive ? 'active' : ''}>
              <Users size={18} />
              Client List
            </NavLink>
          </li>
          <li>
            <NavLink to="/portal/quotes" className={({ isActive }) => isActive ? 'active' : ''}>
              <FileText size={18} />
              Send Quote
            </NavLink>
          </li>
          <li>
            <NavLink to="/portal/itineraries" className={({ isActive }) => isActive ? 'active' : ''}>
              <Map size={18} />
              Send Itinerary
            </NavLink>
          </li>

          <hr className="portal-nav-divider" />

          <li>
            <NavLink to="/" className={({ isActive }) => ''}>
              <Globe size={18} />
              View Website
            </NavLink>
          </li>
          <li>
            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <LogOut size={18} />
              Sign Out
            </a>
          </li>
        </ul>
      </aside>

      <main className="portal-main">
        <div className="portal-topbar">
          <h1>{title}</h1>
          <div className="portal-topbar-user">
            <span>Mark Price</span>
            <div className="portal-topbar-avatar">MP</div>
          </div>
        </div>

        <div className="portal-content">
          {children}
        </div>
      </main>
    </div>
  )
}
