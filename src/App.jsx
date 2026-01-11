import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Customers from "./pages/customer.jsx";
import Meters from "./pages/meters.jsx";
import MeterReadings from "./pages/meterReadings.jsx";
import Tariffs from "./pages/tariffs.jsx";
import Complaints from "./pages/complaints.jsx";
import Bills from "./pages/bills.jsx";
import Reports from "./pages/reports.jsx";
import UtilityDashboard from "./pages/utilityDasboard.jsx";
import Users from "./pages/users.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* protected layout */}
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="meters" element={<Meters />} />
        <Route path="meter-readings" element={<MeterReadings />} />
        <Route path="tariffs" element={<Tariffs />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="bills" element={<Bills />} />
        <Route path="reports" element={<Reports />} />
        <Route path="utility/:utilityId" element={<UtilityDashboard />} />
        <Route
  path="/users"
  element={
    <ProtectedRoute allowedRoles={["SUPER ADMIN"]}>
      <Users />
    </ProtectedRoute>
  }
/>

        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
}

export default App;
