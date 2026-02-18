import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit3, X, Search } from 'lucide-react'
import PortalLayout from '../../components/PortalLayout'
import { supabase } from '../../lib/supabase'

export default function ClientList() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })

  useEffect(() => {
    if (localStorage.getItem('bv_authenticated') !== 'true') {
      navigate('/portal')
      return
    }
    loadClients()
  }, [navigate])

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      // Supabase not configured
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openAddModal = () => {
    setEditingClient(null)
    setForm({ name: '', email: '', phone: '', notes: '' })
    setShowModal(true)
  }

  const openEditModal = (client) => {
    setEditingClient(client)
    setForm({ name: client.name, email: client.email, phone: client.phone, notes: client.notes || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(form)
          .eq('id', editingClient.id)
        if (error) throw error
        showToast('Client updated successfully')
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([form])
        if (error) throw error
        showToast('Client added successfully')
      }
      setShowModal(false)
      loadClients()
    } catch (err) {
      showToast('Error: ' + err.message, 'error')
    }
  }

  const deleteClient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (error) throw error
      showToast('Client deleted')
      loadClients()
    } catch (err) {
      showToast('Error deleting client', 'error')
    }
  }

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PortalLayout title="Client List">
      <div className="portal-card">
        <div className="portal-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2>All Clients</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px 8px 36px',
                  border: '1.5px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  width: '220px',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
          </div>
          <button className="btn-portal" onClick={openAddModal}>
            <Plus size={16} />
            Add Client
          </button>
        </div>

        {filtered.length > 0 ? (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Notes</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id}>
                  <td style={{ fontWeight: 500 }}>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {client.notes || '—'}
                  </td>
                  <td>{new Date(client.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-portal btn-portal-sm btn-portal-outline" onClick={() => openEditModal(client)}>
                        <Edit3 size={14} />
                      </button>
                      <button className="btn-portal btn-portal-sm btn-portal-danger" onClick={() => deleteClient(client.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>{searchTerm ? 'No clients found' : 'No clients yet'}</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Click "Add Client" to add your first client'}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: '#999' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="portal-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any notes about this client..."
                      style={{ minHeight: '80px' }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-portal btn-portal-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-portal">
                  {editingClient ? 'Save Changes' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </PortalLayout>
  )
}
