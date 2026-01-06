import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function Meters() {
  const [meters, setMeters] = useState([])

  const fetchMeters = async () => {
    const res = await axios.get("http://localhost:5000/api/meters")
    setMeters(res.data)
  }

  useEffect(() => {
    fetchMeters()
  }, [])

  
   return (
  <>
  <Link to="/" className="back-btn">
  ← Back
</Link>

    <div className="page-title">Meters</div>

    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Meter Number</th>
            <th>Customer</th>
            <th>Utility</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {meters.map((m) => (
            <tr key={m.meter_id}>
              <td>{m.meter_id}</td>
              <td>{m.meter_number}</td>
              <td>{m.customer_name}</td>
              <td>{m.utility_name}</td>
              <td>{m.status}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => deleteMeter(m.meter_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)

}

export default Meters
