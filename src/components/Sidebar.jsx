import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>UMS Admin</h2>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/customers">Customers</Link>
      <Link to="/meters">Meters</Link>
      <Link to="/meter-readings">Meter Readings</Link>
      <Link to="/tariffs">Tariff Plans</Link>
      <Link to="/complaints">Complaints</Link>
      <Link to="/bills">Bills</Link>
      <Link to="/payments">Payments</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/utility/1">Electricity Overview</Link>
      <Link to="/utility/2">Water Overview</Link>
      <Link to="/utility/3">Gas Overview</Link>
      <Link to="/users">User Management</Link>

    </div>
  )
}

export default Sidebar

