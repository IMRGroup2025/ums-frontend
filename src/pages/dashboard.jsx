import { Link, useNavigate } from "react-router-dom"
import "./dashboard.css"

const stats = [
  { label: "Active meters", value: "1,248", trend: 4.2 },
  { label: "Outstanding bills", value: "$82.6K", trend: -2.8 },
  { label: "Avg. usage", value: "312 kWh", trend: 1.1 },
]

const quickLinks = [
  { label: "Customers", detail: "Add or update account records", path: "/customers" },
  { label: "Service connections", detail: "Register new meters", path: "/meters" },
  { label: "Meter readings", detail: "Capture field visits", path: "/meter-readings" },
  { label: "Tariff plans", detail: "Maintain pricing catalog", path: "/tariffs" },
  { label: "Complaints", detail: "Track and resolve issues", path: "/complaints" },
  { label: "Bills & payments", detail: "Issue and settle invoices", path: "/bills" },
  { label: "Revenue reports", detail: "Analyze performance", path: "/reports" },
]

const bills = [
  { account: "Ridgeview Homes", due: "Jan 12", amount: "$7,560", status: "Pending" },
  { account: "Civic Plaza", due: "Jan 15", amount: "$18,420", status: "Scheduled" },
  { account: "Northwind Stores", due: "Jan 19", amount: "$3,890", status: "Pending" },
]

const notices = [
  { title: "2 service tickets open", detail: "Crew ETA 2h" },
  { title: "13 late payments", detail: "Send reminders" },
  { title: "Valve inspection", detail: "South loop • Jan 10" },
]

function Dashboard() {
  const navigate = useNavigate()
  return (
    <div className="simple-dashboard">
      <header className="simple-dashboard__header">
        <div>
          <p className="eyebrow">Today</p>
          <h1>Utility dashboard</h1>
          <p className="muted">A quick look at field activity, meters, and billing status.</p>
        </div>
        <button
          className="simple-dashboard__button"
          type="button"
          onClick={() => navigate("/meters")}
        >
          Add meter
        </button>
      </header>

      <section className="simple-dashboard__stats">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <p className="stat-card__label">{stat.label}</p>
            <p className="stat-card__value">{stat.value}</p>
            <span className={`stat-card__trend ${stat.trend >= 0 ? "is-up" : "is-down"}`}>
              {stat.trend >= 0 ? "+" : ""}
              {stat.trend}% vs last week
            </span>
          </article>
        ))}
      </section>

      <section className="quick-links">
        {quickLinks.map((link) => (
          <article key={link.label} className="quick-card">
            <div>
              <p className="quick-card__label">{link.label}</p>
              <p className="muted">{link.detail}</p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => navigate(link.path)}
            >
              Open
            </button>
          </article>
        ))}
      </section>

      <section className="simple-dashboard__grid">
        <article className="panel">
          <div className="panel__header">
            <h2>Upcoming bills</h2>
            <button className="link-button">View all</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Due</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.account}>
                  <td>{bill.account}</td>
                  <td>{bill.due}</td>
                  <td>{bill.amount}</td>
                  <td>
                    <span className="tag">{bill.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel">
          <div className="panel__header">
            <h2>Quick notes</h2>
            <button className="link-button">Log update</button>
          </div>
          <ul className="notice-list">
            {notices.map((notice) => (
              <li key={notice.title}>
                <p className="notice-title">{notice.title}</p>
                <p className="notice-detail">{notice.detail}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}

export default Dashboard
