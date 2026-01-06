import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function Customers() {
  const [customers, setCustomers] = useState([])

  const fetchCustomers = async () => {
    const res = await axios.get("http://localhost:5000/api/customers")
    setCustomers(res.data)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/" className="back-btn">
  ← Back
</Link>

      <h2>Customers</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.customer_id}>
              <td>{c.customer_id}</td>
              <td>{c.name}</td>
              <td>{c.customer_type}</td>
              <td>{c.address}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Customers
