import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./common.css"

function Reports() {
  const [summary, setSummary] = useState(null)
  const [defaulters, setDefaulters] = useState([])
  const [usage, setUsage] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const [summaryRes, defaultersRes, usageRes] = await Promise.all([
        axios.get("http://localhost:5000/api/reports/summary"),
        axios.get("http://localhost:5000/api/reports/defaulters"),
        axios.get("http://localhost:5000/api/reports/usage-trend"),
      ])
      setSummary(summaryRes.data)
      setDefaulters(defaultersRes.data)
      setUsage(usageRes.data)
    }

    fetchData().catch(console.error)
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
