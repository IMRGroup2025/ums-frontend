import { Link, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";

function Sidebar() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.user_type;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">UMS</div>
        <div className="sidebar__title">Utility Admin</div>
      </div>

      <nav className="sidebar__nav">
        <Link
          to="/dashboard"
          className={`sidebar__link ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <span className="sidebar__label">Dashboard</span>
        </Link>

        <Link
          to="/customers"
          className={`sidebar__link ${location.pathname === "/customers" ? "active" : ""}`}
        >
          <span className="sidebar__label">Customers</span>
        </Link>

        <Link
          to="/meters"
          className={`sidebar__link ${location.pathname === "/meters" ? "active" : ""}`}
        >
          <span className="sidebar__label">Meters</span>
        </Link>

        <Link
          to="/meter-readings"
          className={`sidebar__link ${location.pathname === "/meter-readings" ? "active" : ""}`}
        >
          <span className="sidebar__label">Meter Readings</span>
        </Link>

        <Link
          to="/tariffs"
          className={`sidebar__link ${location.pathname === "/tariffs" ? "active" : ""}`}
        >
          <span className="sidebar__label">Tariff Plans</span>
        </Link>

        <Link
          to="/bills"
          className={`sidebar__link ${location.pathname === "/bills" ? "active" : ""}`}
        >
          <span className="sidebar__label">Bills</span>
        </Link>

        <Link
          to="/complaints"
          className={`sidebar__link ${location.pathname === "/complaints" ? "active" : ""}`}
        >
          <span className="sidebar__label">Complaints</span>
        </Link>

  

        <Link
          to="/reports"
          className={`sidebar__link ${location.pathname === "/reports" ? "active" : ""}`}
        >
          <span className="sidebar__label">Reports</span>
        </Link>

        {/*  SUPER ADMIN ONLY */}
        {role === "SUPER ADMIN" && (
          <Link
            to="/users"
            className={`sidebar__link sidebar__link--admin ${
              location.pathname === "/users" ? "active" : ""
            }`}
          >
            <span className="sidebar__label">User Management</span>
          </Link>
        )}

        <button onClick={logout} className="sidebar__logout">
          <span className="sidebar__label">Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
