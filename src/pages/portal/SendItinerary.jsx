import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Plus, X, Map, Trash2, GripVertical } from 'lucide-react'
import PortalLayout from '../../components/PortalLayout'
import { supabase } from '../../lib/supabase'

export default function SendItinerary() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [itineraries, setItineraries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(null)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    client_id: '',
    trip_name: '',
    destination: '',
    start_date: '',
    end_date: '',
    notes: '',
  })
  const [days, setDays] = useState([
    { day_number: 1, title: '', description: '' },
  ])

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

      const { data: itineraryData } = await supabase
        .from('itineraries')
        .select('*, clients(name, email)')
        .order('created_at', { ascending: false })

      setClients(clientData || [])
      setItineraries(itineraryData || [])
    } catch (err) {
      // Supabase not configured
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const addDay = () => {
    setDays([...days, { day_number: days.length + 1, title: '', description: '' }])
  }

  const removeDay = (index) => {
    if (days.length <= 1) return
    const updated = days.filter((_, i) => i !== index).map((d, i) => ({
      ...d,
      day_number: i + 1,
    }))
    setDays(updated)
  }

  const updateDay = (index, field, value) => {
    const updated = [...days]
    updated[index][field] = value
    setDays(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    try {
      const { data: itinerary, error: itineraryError } = await supabase
        .from('itineraries')
        .insert([{
          client_id: form.client_id,
          trip_name: form.trip_name,
          destination: form.destination,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          notes: form.notes,
          status: 'sent',
        }])
        .select()
        .single()

      if (itineraryError) throw itineraryError

      // Insert itinerary days
      const daysToInsert = days
        .filter(d => d.title.trim())
        .map(d => ({
          itinerary_id: itinerary.id,
          day_number: d.day_number,
          title: d.title,
          description: d.description,
        }))

      if (daysToInsert.length > 0) {
        const { error: daysError } = await supabase
          .from('itinerary_days')
          .insert(daysToInsert)

        if (daysError) throw daysError
      }

      showToast('Itinerary sent successfully!')
      setShowForm(false)
      setForm({ client_id: '', trip_name: '', destination: '', start_date: '', end_date: '', notes: '' })
      setDays([{ day_number: 1, title: '', description: '' }])
      loadData()
    } catch (err) {
      showToast('Error: ' + err.message, 'error')
    } finally {
      setSending(false)
    }
  }

  const deleteItinerary = async (id) => {
    if (!window.confirm('Delete this itinerary?')) return
    try {
      await supabase.from('itinerary_days').delete().eq('itinerary_id', id)
      await supabase.from('itineraries').delete().eq('id', id)
      showToast('Itinerary deleted')
      loadData()
    } catch (err) {
      showToast('Error deleting itinerary', 'error')
    }
  }

  return (
    <PortalLayout title="Trip Itineraries">
      {!showForm ? (
        <div className="portal-card">
          <div className="portal-card-header">
            <h2>All Itineraries</h2>
            <button className="btn-portal" onClick={() => setShowForm(true)}>
              <Plus size={16} />
              New Itinerary
            </button>
          </div>

          {itineraries.length > 0 ? (
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Trip Name</th>
                  <th>Destination</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {itineraries.map((it) => (
                  <tr key={it.id}>
                    <td style={{ fontWeight: 500 }}>{it.clients?.name || 'Unknown'}</td>
                    <td>{it.trip_name}</td>
                    <td>{it.destination}</td>
                    <td>
                      {it.start_date && it.end_date
                        ? `${new Date(it.start_date).toLocaleDateString()} - ${new Date(it.end_date).toLocaleDateString()}`
                        : '—'}
                    </td>
                    <td>
                      <span className={`badge badge-${it.status}`}>
                        {it.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-portal btn-portal-sm btn-portal-danger" onClick={() => deleteItinerary(it.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <Map size={48} />
              <h3>No itineraries yet</h3>
              <p>Create your first trip itinerary for a client</p>
            </div>
          )}
        </div>
      ) : (
        <div className="portal-card">
          <div className="portal-card-header">
            <h2>Create New Itinerary</h2>
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
                  <label>Trip Name *</label>
                  <input
                    type="text"
                    value={form.trip_name}
                    onChange={(e) => setForm({ ...form, trip_name: e.target.value })}
                    placeholder="e.g. Italian Dream Vacation"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Destination *</label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="e.g. Rome, Florence, Venice"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '12px' }}>
                  Daily Itinerary
                </label>

                {days.map((day, index) => (
                  <div className="itinerary-day" key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4>Day {day.day_number}</h4>
                      {days.length > 1 && (
                        <button type="button" onClick={() => removeDay(index)} style={{ background: 'none', color: '#e74c3c', padding: '2px' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Day title (e.g. Arrival in Rome)"
                      value={day.title}
                      onChange={(e) => updateDay(index, 'title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1.5px solid #e5e5e5',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        marginBottom: '8px',
                        fontFamily: 'var(--font-body)',
                      }}
                    />
                    <textarea
                      placeholder="Day activities and details..."
                      value={day.description}
                      onChange={(e) => updateDay(index, 'description', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1.5px solid #e5e5e5',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        minHeight: '60px',
                        resize: 'vertical',
                        fontFamily: 'var(--font-body)',
                      }}
                    />
                  </div>
                ))}

                <button type="button" className="itinerary-add-day" onClick={addDay}>
                  <Plus size={16} />
                  Add Another Day
                </button>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes, recommendations, or special instructions..."
                  style={{ minHeight: '80px' }}
                />
              </div>

              <button type="submit" className="btn-portal" disabled={sending}>
                <Send size={16} />
                {sending ? 'Sending...' : 'Send Itinerary'}
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
