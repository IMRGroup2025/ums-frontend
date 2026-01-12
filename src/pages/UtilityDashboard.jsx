import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"

function UtilityDashboard() {
  const { utilityId } = useParams()
  const [data, setData] = useState(null)

  
  const utilityMap = {
    1: "Electricity",
    2: "Water",
    3: "Gas",
  }

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/dashboard/${utilityId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
  }, [utilityId])

  if (!data) return <p>Loading...</p>

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>

        {/* EXPORT BUTTONS */}
        <div>
          <a
            href={`http://localhost:5000/api/export/pdf/${utilityId}`}
            className="add-btn"
            style={{ marginRight: "10px" }}
          >
            📄 Export PDF
          </a>

          
        </div>
      </div>

      <h2>{utilityMap[utilityId]} Dashboard</h2>

      {/* STAT CARDS */}
      <div className="card-container">
        <div className="card">
          <h3>Total Customers</h3>
          <p>{data.total_customers}</p>
        </div>

        <div className="card">
          <h3>Total Meters</h3>
          <p>{data.total_meters}</p>
        </div>

        <div className="card">
          <h3>Total Consumption</h3>
          <p>{data.total_consumption}</p>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <p>LKR {data.total_revenue}</p>
        </div>

        <div className="card">
          <h3>Unpaid Bills</h3>
          <p>{data.unpaid_bills}</p>
        </div>
      </div>
    </div>
  )
}

export default UtilityDashboard
