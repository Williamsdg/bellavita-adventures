import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, Map } from 'lucide-react'
import PortalLayout from '../../components/PortalLayout'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ clients: 0, quotes: 0, itineraries: 0 })
  const [recentClients, setRecentClients] = useState([])

  useEffect(() => {
    if (localStorage.getItem('bv_authenticated') !== 'true') {
      navigate('/portal')
      return
    }
    loadStats()
  }, [navigate])

  const loadStats = async () => {
    try {
      const { count: clientCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

      const { count: quoteCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })

      const { count: itineraryCount } = await supabase
        .from('itineraries')
        .select('*', { count: 'exact', head: true })

      setStats({
        clients: clientCount || 0,
        quotes: quoteCount || 0,
        itineraries: itineraryCount || 0,
      })

      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentClients(clients || [])
    } catch (err) {
      // Supabase not configured yet - show zeros
    }
  }

  return (
    <PortalLayout title="Dashboard">
      <div className="portal-stats">
        <div className="portal-stat-card" onClick={() => navigate('/portal/clients')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="stat-label">Total Clients</p>
              <p className="stat-value">{stats.clients}</p>
            </div>
            <Users size={24} style={{ color: '#c9a96e', opacity: 0.6 }} />
          </div>
        </div>

        <div className="portal-stat-card" onClick={() => navigate('/portal/quotes')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="stat-label">Quotes Sent</p>
              <p className="stat-value">{stats.quotes}</p>
            </div>
            <FileText size={24} style={{ color: '#c9a96e', opacity: 0.6 }} />
          </div>
        </div>

        <div className="portal-stat-card" onClick={() => navigate('/portal/itineraries')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="stat-label">Itineraries Sent</p>
              <p className="stat-value">{stats.itineraries}</p>
            </div>
            <Map size={24} style={{ color: '#c9a96e', opacity: 0.6 }} />
          </div>
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-card-header">
          <h2>Recent Clients</h2>
          <button className="btn-portal btn-portal-sm" onClick={() => navigate('/portal/clients')}>
            View All
          </button>
        </div>

        {recentClients.length > 0 ? (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map((client) => (
                <tr key={client.id}>
                  <td style={{ fontWeight: 500 }}>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{new Date(client.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Users size={48} />
            <h3>No clients yet</h3>
            <p>Add your first client to get started</p>
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
