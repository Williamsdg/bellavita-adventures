import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PortalLogin from './pages/portal/Login'
import PortalDashboard from './pages/portal/Dashboard'
import ClientList from './pages/portal/ClientList'
import SendQuote from './pages/portal/SendQuote'
import SendItinerary from './pages/portal/SendItinerary'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portal" element={<PortalLogin />} />
        <Route path="/portal/dashboard" element={<PortalDashboard />} />
        <Route path="/portal/clients" element={<ClientList />} />
        <Route path="/portal/quotes" element={<SendQuote />} />
        <Route path="/portal/itineraries" element={<SendItinerary />} />
      </Routes>
    </Router>
  )
}

export default App
