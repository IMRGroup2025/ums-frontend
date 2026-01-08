import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/dashboard.jsx"
import Customers from "./pages/customer.jsx"
import Meters from "./pages/meters.jsx"
import MeterReadings from "./pages/meterReadings.jsx"
import Tariffs from "./pages/tariffs.jsx"
import Complaints from "./pages/complaints.jsx"
import Bills from "./pages/bills.jsx"
import Payments from "./pages/payments.jsx"
import Reports from "./pages/reports.jsx"
import UtilityDashboard from "./pages/utilityDasboard.jsx"
import Users from "./pages/users.jsx"
import AppLayout from "./components/AppLayout.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/meters" element={<Meters />} />
        <Route path="/meter-readings" element={<MeterReadings />} />
        <Route path="/tariffs" element={<Tariffs />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/utility/:utilityId" element={<UtilityDashboard />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  )
}

export default App
