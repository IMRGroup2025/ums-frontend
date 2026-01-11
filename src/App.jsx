import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customer.jsx";
import Meters from "./pages/Meters.jsx";
import MeterReadings from "./pages/MeterReadings.jsx";
import Tariffs from "./pages/Tariffs.jsx";
import Complaints from "./pages/Complaints.jsx";
import Bills from "./pages/Bills.jsx";
import Reports from "./pages/Reports.jsx";
import UtilityDashboard from "./pages/UtilityDasboard.jsx";
import Users from "./pages/Users.jsx";
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
