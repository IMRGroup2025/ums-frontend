import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>UMS Admin</h2>

      <Link to="/"> Dashboard</Link>
      <Link to="/customers">Customers</Link>
      <Link to="/meters"> Meters</Link>
      <Link to="/bills"> Bills</Link>
    </div>
  )
}

export default Sidebar

