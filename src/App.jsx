import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Home from "./pages/home"
import Customers from "./pages/customer"
import Meters from "./pages/meters"

function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/meters" element={<Meters />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

