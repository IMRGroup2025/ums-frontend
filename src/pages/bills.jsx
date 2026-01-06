import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function Bills() {
  const [bills, setBills] = useState([])

  const fetchBills = async () => {
    const res = await axios.get("http://localhost:5000/api/bills")
    setBills(res.data)
  }

  useEffect(() => {
    fetchBills()
  }, [])

  const payBill = async (bill) => {
    const method = window.prompt("Payment method: Cash / Card / Online", "Cash")
    if (!method) return

    await axios.post("http://localhost:5000/api/payments", {
      bill_id: bill.bill_id,
      amount_paid: bill.amount,
      payment_method: method,
    })

    fetchBills()
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
      </div>

      <h2>Bills</h2>

      <div className="card full-width">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Utility</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((b) => (
              <tr key={b.bill_id}>
                <td>{b.bill_id}</td>
                <td>{b.customer_name}</td>
                <td>{b.utility_name}</td>
                <td>{b.billing_month}</td>
                <td>LKR {b.amount}</td>
                <td>
                  <span
                    className={`status ${
                      b.status === "PAID" ? "paid" : "unpaid"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td>
                  {b.status === "UNPAID" ? (
                    <button
                      className="add-btn"
                      onClick={() => payBill(b)}
                    >
                      Pay
                    </button>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Bills
