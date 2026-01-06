import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Home from "./pages/home.jsx"
import Customers from "./pages/customer.jsx"
import Meters from "./pages/meters.jsx"
import Bills from "./pages/bills.jsx"
import Payments from "./pages/payments.jsx"
import UtilityDashboard from "./pages/utilityDasboard.jsx"




function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/meters" element={<Meters />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/utility/:utilityId" element={<UtilityDashboard />} />
          
        </Routes>
      </div>
    </div>
  )
}

export default App

