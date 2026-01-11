import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../utils/api"
import "./dashboard.css"

const utilities = [
  {
    label: "Electricity",
    value: "1,234",
    unit: "kWh",
    monthlyUsage: 24,
    amount: "LKR 156,320",
    change: -12,
    color: "#f97316",
  },
  {
    label: "Water",
    value: "456",
    unit: "m³",
    monthlyUsage: 18,
    amount: "LKR 14,560",
    change: 5,
    color: "#0ea5e9",
  },
  {
    label: "Gas",
    value: "789",
    unit: "m³",
    monthlyUsage: 31,
    amount: "LKR 98,500",
    change: -8,
    color: "#f43f5e",
  },
]

const billing = [
  { account: "Ridgeview Homes", due: "Jan 12", amount: "LKR 7,560", status: "Pending" },
  { account: "Civic Plaza", due: "Jan 15", amount: "LKR 18,420", status: "Scheduled" },
  { account: "Northwind Stores", due: "Jan 19", amount: "LKR 3,890", status: "Pending" },
]

const usageBreakdown = [
  { label: "Electricity", value: 45, color: "#4f46e5" },
  { label: "Water", value: 15, color: "#0ea5e9" },
  { label: "Gas", value: 40, color: "#f43f5e" },
]

const costBreakdown = [
  { label: "Electricity", amount: "LKR 156,320", value: 51, color: "#6366f1" },
  { label: "Water", amount: "LKR 45,600", value: 15, color: "#0ea5e9" },
  { label: "Gas", amount: "LKR 114,080", value: 34, color: "#f43f5e" },
]

const monthlyComparison = [
  { label: "Electricity", current: 1234, previous: 1050 },
  { label: "Water", current: 456, previous: 380 },
  { label: "Gas", current: 789, previous: 650 },
]

const alerts = [
  {
    id: 1,
    type: "warning",
    icon: "⚠",
    title: "High Water Usage Detected",
    description: "Your water consumption is 40% above average this month.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "warning",
    icon: "⚠",
    title: "Gas Spike Detected",
    description: "Unusual gas consumption pattern detected on Dec 15. Please check your meter.",
    timestamp: "3 days ago",
  },
  {
    id: 3,
    type: "info",
    icon: "ℹ",
    title: "Peak Hours Alert",
    description: "Peak electricity hours are 6 PM – 9 PM. Consider shifting energy-intensive tasks.",
    timestamp: "1 day ago",
  },
  {
    id: 4,
    type: "info",
    icon: "ℹ",
    title: "Maintenance Reminder",
    description: "Schedule utility meter inspection - last checked 6 months ago.",
    timestamp: "5 days ago",
  },
]

function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [utilities, setUtilities] = useState([
    {
      label: "Electricity",
      value: "1,234",
      unit: "kWh",
      monthlyUsage: 24,
      amount: "LKR 156,320",
      change: -12,
      color: "#f97316",
      totalCustomers: 0,
    },
    {
      label: "Water",
      value: "456",
      unit: "m³",
      monthlyUsage: 18,
      amount: "LKR 14,560",
      change: 5,
      color: "#0ea5e9",
      totalCustomers: 0,
    },
    {
      label: "Gas",
      value: "789",
      unit: "m³",
      monthlyUsage: 31,
      amount: "LKR 98,500",
      change: -8,
      color: "#f43f5e",
      totalCustomers: 0,
    },
  ])

  useEffect(() => {
    const fetchUtilityData = async () => {
      try {
        const res = await api.get("/utilities/overview")
        // res.data should be an array like:
        // [
        //   { utility_name: "Electricity", total_customers: 45, total_meters: 52, ... },
        //   { utility_name: "Water", total_customers: 32, ... },
        //   { utility_name: "Gas", total_customers: 28, ... }
        // ]
        
        setUtilities(prevUtilities => 
          prevUtilities.map(util => {
            const apiData = res.data.find(
              item => item.utility_name?.toLowerCase() === util.label.toLowerCase()
            )
            if (apiData) {
              return {
                ...util,
                totalCustomers: apiData.total_customers || 0
              }
            }
            return util
          })
        )
      } catch (err) {
        console.error("Failed to fetch utility overview:", err)
      }
    }

    fetchUtilityData()
  }, [])

  const maxValue = Math.max(
    ...monthlyComparison.flatMap((item) => [item.current, item.previous])
  )

  return (
    <div className="dash">
      <header className="dash-hero">
        <div>
          <p className="dash-kicker">Utility management</p>
          <h1>Monitor and manage usage</h1>
          <p className="dash-subtitle">Electricity, water, and gas at a glance. Values shown in LKR.</p>
        </div>
        <div className="dash-actions">
          <button
            type="button"
            className="dash-btn dash-btn--primary"
            onClick={() => navigate("/bills")}
          >
            Bills
          </button>
          <button
            type="button"
            className="dash-btn dash-btn--ghost"
            onClick={() => navigate("/reports")}
          >
            Reports
          </button>
        </div>
      </header>

      <section className="dash-cards">
        {utilities.map((item) => {
          const isUp = item.change >= 0
          return (
            <article key={item.label} className="dash-card">
              <div className="dash-card__bar" style={{ backgroundColor: item.color }} />
              <div className="dash-card__body">
                <div className="dash-card__header">
                  <div>
                    <p className="dash-label">{item.label} Overview</p>
                    <div className="dash-value-row">
                      <span className="dash-value">{item.value}</span>
                      <span className="dash-unit">{item.unit}</span>
                    </div>
                    {item.totalCustomers > 0 && (
                      <p className="dash-label" style={{ marginTop: "8px", fontSize: "13px" }}>
                        {item.totalCustomers} customers
                      </p>
                    )}
                  </div>
                  <div className="dash-badge" style={{ color: item.color, borderColor: item.color }}>
                    {item.label.slice(0, 1)}
                  </div>
                </div>

                <div className="dash-metrics">
                  <div>
                    <p className="dash-label">Monthly usage</p>
                    <p className="dash-strong">{item.monthlyUsage}%</p>
                    <div className="dash-progress">
                      <span
                        className="dash-progress__fill"
                        style={{ width: `${item.monthlyUsage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="dash-label">This month</p>
                    <p className="dash-strong">{item.amount}</p>
                    <div className="dash-change" data-trend={isUp ? "up" : "down"}>
                      <span>{isUp ? "↑" : "↓"}</span>
                      <span>{Math.abs(item.change)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <nav className="dash-tabs" aria-label="Dashboard tabs">
        <button
          className={`dash-tab ${activeTab === "overview" ? "dash-tab--active" : ""}`}
          type="button"
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`dash-tab ${activeTab === "analysis" ? "dash-tab--active" : ""}`}
          type="button"
          onClick={() => setActiveTab("analysis")}
        >
          Detailed Analysis
        </button>
        <button
          className={`dash-tab ${activeTab === "alerts" ? "dash-tab--active" : ""}`}
          type="button"
          onClick={() => setActiveTab("alerts")}
        >
          Alerts
        </button>
      </nav>

      {activeTab === "overview" && (
      <section className="dash-grid">
        <article className="dash-panel">
          <div className="dash-panel__header">
            <div>
              <p className="dash-label">Monthly usage distribution</p>
              <h2>Percentage by utility</h2>
            </div>
            <button className="dash-link" type="button" onClick={() => navigate("/reports")}>
              View report
            </button>
          </div>
          <div className="dash-chart">
            <div className="dash-donut">
              {usageBreakdown.map((slice) => (
                <span
                  key={slice.label}
                  className="dash-donut__slice"
                  style={{ background: slice.color, width: `${slice.value}%` }}
                />
              ))}
              </div>
            <ul className="dash-legend">
              {usageBreakdown.map((item) => (
                <li key={item.label}>
                  <span className="dash-dot" style={{ background: item.color }} />
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="dash-panel">
          <div className="dash-panel__header">
            <div>
              <p className="dash-label">Cost breakdown</p>
              <h2>Total: LKR 316,000</h2>
            </div>
            <button className="dash-link" type="button" onClick={() => navigate("/tariffs")}>
              Edit tariffs
            </button>
          </div>
          <ul className="dash-bars">
            {costBreakdown.map((item) => (
              <li key={item.label}>
                <div className="dash-bars__top">
                  <span>{item.label}</span>
                  <strong>{item.amount}</strong>
                </div>
                <div className="dash-bar">
                  <span className="dash-bar__fill" style={{ width: `${item.value}%`, background: item.color }} />
                </div>
                <p className="dash-subtle">{item.value}% of total</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
      )}

      {activeTab === "analysis" && (
        <section className="dash-panel dash-analysis">
          <div className="dash-panel__header">
            <div>
              <h2>Monthly Comparison</h2>
              <p className="dash-label">Current month vs previous month</p>
            </div>
          </div>
          <div className="dash-bar-chart">
            <div className="dash-bar-chart__y-axis">
              {[1400, 1050, 700, 350, 0].map((val) => (
                <span key={val}>{val}</span>
              ))}
            </div>
            <div className="dash-bar-chart__content">
              <div className="dash-bar-chart__bars">
                {monthlyComparison.map((item) => (
                  <div key={item.label} className="dash-bar-group">
                    <div className="dash-bar-pair">
                      <div
                        className="dash-bar-item dash-bar-item--current"
                        style={{ height: `${(item.current / maxValue) * 100}%` }}
                      />
                      <div
                        className="dash-bar-item dash-bar-item--previous"
                        style={{ height: `${(item.previous / maxValue) * 100}%` }}
                      />
                    </div>
                    <p className="dash-bar-label">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="dash-bar-chart__legend">
            <div className="dash-legend-item">
              <span className="dash-legend-box dash-legend-box--current" />
              <span>Current Month</span>
            </div>
            <div className="dash-legend-item">
              <span className="dash-legend-box dash-legend-box--previous" />
              <span>Previous Month</span>
            </div>
          </div>
        </section>
      )}

      {activeTab === "alerts" && (
        <section className="dash-alerts">
          <div className="dash-alerts__grid">
            {alerts.map((alert) => (
              <article key={alert.id} className={`dash-alert dash-alert--${alert.type}`}>
                <div className="dash-alert__icon">{alert.icon}</div>
                <div className="dash-alert__content">
                  <h3 className="dash-alert__title">{alert.title}</h3>
                  <p className="dash-alert__description">{alert.description}</p>
                  <p className="dash-alert__timestamp">{alert.timestamp}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "overview" && (
      <section className="dash-panel dash-panel--wide">
        <div className="dash-panel__header">
          <div>
            <p className="dash-label">Billing</p>
            <h2>Upcoming bills (LKR)</h2>
          </div>
          <button type="button" className="dash-link" onClick={() => navigate("/bills")}>
            View all
          </button>
        </div>
        <div className="dash-table">
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
              {billing.map((bill) => (
                <tr key={bill.account}>
                  <td>{bill.account}</td>
                  <td>{bill.due}</td>
                  <td>{bill.amount}</td>
                  <td>
                    <span className="dash-tag">{bill.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      )}
    </div>
  )
}

export default Dashboard
