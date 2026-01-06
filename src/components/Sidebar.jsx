import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>UMS Admin</h2>

      <Link to="/"> Dashboard</Link>
      <Link to="/customers">Customers</Link>
      <Link to="/meters"> Meters</Link>
      <Link to="/bills"> Bills</Link>
      <Link to="/payments">Payments</Link>
      <Link to="/utility/1">Electricity</Link>
<Link to="/utility/2"> Water</Link>
<Link to="/utility/3"> Gas</Link>

    </div>
  )
}

export default Sidebar

