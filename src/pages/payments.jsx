import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./common.css"

export default function Payments() {
  const [payments, setPayments] = useState([])

  const fetchPayments = async () => {
    const res = await axios.get("http://localhost:5000/api/payments")
    setPayments(res.data)
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
      </div>

      <h2>Payments</h2>

      <div className="card full-width">
        <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Bill ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map(p => (
            <tr key={p.payment_id}>
              <td>{p.payment_id}</td>
              <td>{p.customer_name}</td>
              <td>{p.bill_id}</td>
              <td>Rs. {p.amount_paid}</td>
              <td>{p.payment_method}</td>
              <td>{p.payment_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
