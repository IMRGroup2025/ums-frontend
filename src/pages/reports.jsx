import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./common.css"

function Reports() {
  const [summary, setSummary] = useState({
    revenue: "485,750",
    outstanding: "127,400",
    defaulters: 8
  })
  const [defaulters, setDefaulters] = useState([
    {
      customer_id: 1,
      customer_name: "Perera & Sons",
      last_payment: "Nov 2025",
      amount_due: "45,200",
      utility: "Electricity"
    },
    {
      customer_id: 2,
      customer_name: "Silva Trading Co",
      last_payment: "Oct 2025",
      amount_due: "38,950",
      utility: "Water"
    },
    {
      customer_id: 3,
      customer_name: "Fernando Industries",
      last_payment: "Dec 2025",
      amount_due: "22,100",
      utility: "Gas"
    },
    {
      customer_id: 4,
      customer_name: "Jayawardena Store",
      last_payment: "Nov 2025",
      amount_due: "21,150",
      utility: "Electricity"
    }
  ])
  const [usage, setUsage] = useState([
    { month: "2025-08", electricity: "12,450", water: "8,320", revenue: "145,200" },
    { month: "2025-09", electricity: "13,680", water: "8,750", revenue: "158,900" },
    { month: "2025-10", electricity: "14,200", water: "9,100", revenue: "167,300" },
    { month: "2025-11", electricity: "13,950", water: "8,900", revenue: "162,450" },
    { month: "2025-12", electricity: "15,100", water: "9,450", revenue: "178,600" },
    { month: "2026-01", electricity: "14,800", water: "9,200", revenue: "172,100" }
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, defaultersRes, usageRes] = await Promise.all([
          axios.get("http://localhost:5000/api/reports/summary"),
          axios.get("http://localhost:5000/api/reports/defaulters"),
          axios.get("http://localhost:5000/api/reports/usage-trend"),
        ])
        setSummary(summaryRes.data)
        setDefaulters(defaultersRes.data)
        setUsage(usageRes.data)
      } catch (err) {
        console.log("Using default data:", err.message)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
      </div>

      <h2>Reports</h2>

      <div className="stat-grid">
        <article className="stat-card">
          <p className="stat-card__label">Revenue (30 days)</p>
          <p className="stat-card__value">{summary ? `LKR ${summary.revenue}` : "—"}</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Outstanding</p>
          <p className="stat-card__value">{summary ? `LKR ${summary.outstanding}` : "—"}</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Active defaulters</p>
          <p className="stat-card__value">{summary ? summary.defaulters : "—"}</p>
        </article>
      </div>

      <div className="detail-grid" style={{ marginTop: "28px" }}>
        <article className="detail-card">
          <div className="section-header">
            <div>
              <p className="section-kicker">Revenue trend</p>
              <h2>Usage vs revenue</h2>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>kWh</th>
                <th>m³</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {usage.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>{row.electricity}</td>
                  <td>{row.water}</td>
                  <td>LKR {row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="detail-card">
          <div className="section-header">
            <div>
              <p className="section-kicker">Collections</p>
              <h2>Top defaulters</h2>
            </div>
          </div>
          <ul className="bill-list">
            {defaulters.map((account) => (
              <li key={account.customer_id}>
                <div>
                  <p className="bill-account">{account.customer_name}</p>
                  <p className="bill-due">Due since {account.last_payment}</p>
                </div>
                <div className="bill-meta">
                  <span className="bill-amount">LKR {account.amount_due}</span>
                  <span className="badge badge--neutral">{account.utility}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  )
}

export default Reports
