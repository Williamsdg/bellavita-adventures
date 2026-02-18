import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Plus, X, FileText, Trash2 } from 'lucide-react'
import PortalLayout from '../../components/PortalLayout'
import { supabase } from '../../lib/supabase'

export default function SendQuote() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [quotes, setQuotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(null)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    client_id: '',
    destination: '',
    travel_dates: '',
    travelers: '',
    package_details: '',
    price: '',
    notes: '',
  })

  useEffect(() => {
    if (localStorage.getItem('bv_authenticated') !== 'true') {
      navigate('/portal')
      return
    }
    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .order('name')

      const { data: quoteData } = await supabase
        .from('quotes')
        .select('*, clients(name, email)')
        .order('created_at', { ascending: false })

      setClients(clientData || [])
      setQuotes(quoteData || [])
    } catch (err) {
      // Supabase not configured
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    try {
      const { error } = await supabase
        .from('quotes')
        .insert([{
          client_id: form.client_id,
          destination: form.destination,
          travel_dates: form.travel_dates,
          travelers: parseInt(form.travelers) || 1,
          package_details: form.package_details,
          price: parseFloat(form.price) || 0,
          notes: form.notes,
          status: 'sent',
        }])

      if (error) throw error

      showToast('Quote sent successfully!')
      setShowForm(false)
      setForm({ client_id: '', destination: '', travel_dates: '', travelers: '', package_details: '', price: '', notes: '' })
      loadData()
    } catch (err) {
      showToast('Error: ' + err.message, 'error')
    } finally {
      setSending(false)
    }
  }

  const deleteQuote = async (id) => {
    if (!window.confirm('Delete this quote?')) return
    try {
      await supabase.from('quotes').delete().eq('id', id)
      showToast('Quote deleted')
      loadData()
    } catch (err) {
      showToast('Error deleting quote', 'error')
    }
  }

  return (
    <PortalLayout title="Trip Quotes">
      {!showForm ? (
        <div className="portal-card">
          <div className="portal-card-header">
            <h2>All Quotes</h2>
            <button className="btn-portal" onClick={() => setShowForm(true)}>
              <Plus size={16} />
              New Quote
            </button>
          </div>

          {quotes.length > 0 ? (
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Destination</th>
                  <th>Travel Dates</th>
                  <th>Travelers</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td style={{ fontWeight: 500 }}>{quote.clients?.name || 'Unknown'}</td>
                    <td>{quote.destination}</td>
                    <td>{quote.travel_dates}</td>
                    <td>{quote.travelers}</td>
                    <td>${parseFloat(quote.price).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${quote.status}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-portal btn-portal-sm btn-portal-danger" onClick={() => deleteQuote(quote.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <FileText size={48} />
              <h3>No quotes yet</h3>
              <p>Create your first trip quote for a client</p>
            </div>
          )}
        </div>
      ) : (
        <div className="portal-card">
          <div className="portal-card-header">
            <h2>Create New Quote</h2>
            <button className="btn-portal btn-portal-outline" onClick={() => setShowForm(false)}>
              <X size={16} />
              Cancel
            </button>
          </div>

          <div style={{ padding: '28px' }}>
            <form className="portal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Client *</label>
                <select
                  value={form.client_id}
                  onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                  required
                >
                  <option value="">Choose a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Destination *</label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="e.g. Amalfi Coast, Italy"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Travel Dates</label>
                  <input
                    type="text"
                    value={form.travel_dates}
                    onChange={(e) => setForm({ ...form, travel_dates: e.target.value })}
                    placeholder="e.g. June 15 - June 28, 2026"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    value={form.travelers}
                    onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                    placeholder="2"
                  />
                </div>
                <div className="form-group">
                  <label>Quoted Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="5,000.00"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Package Details *</label>
                <textarea
                  value={form.package_details}
                  onChange={(e) => setForm({ ...form, package_details: e.target.value })}
                  placeholder="Describe the trip package: flights, accommodations, activities, meals included, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes for this quote..."
                  style={{ minHeight: '80px' }}
                />
              </div>

              <button type="submit" className="btn-portal" disabled={sending}>
                <Send size={16} />
                {sending ? 'Sending...' : 'Send Quote'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </PortalLayout>
  )
}
