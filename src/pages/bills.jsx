import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./common.css";

function Bills() {
  const [bills, setBills] = useState([]);
  const [payingId, setPayingId] = useState(null);

  const fetchBills = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bills");
      setBills(res.data);
    } catch (err) {
      console.error("FETCH BILLS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  /* =========================
     MARK BILL AS PAID
  ========================= */
  const markAsPaid = async (bill) => {
    if (bill.status === "PAID") return;

    try {
      setPayingId(bill.bill_id);

      // Optimistic UI update so it shows PAID immediately
      setBills((curr) =>
        curr.map((b) =>
          b.bill_id === bill.bill_id ? { ...b, status: "PAID" } : b
        )
      );

      await axios.put(`http://localhost:5000/api/bills/${bill.bill_id}/pay`);
      await fetchBills();
    } catch (err) {
      console.error("PAYMENT ERROR:", err.response?.data || err.message);
      alert("Failed to record payment");
      // Revert optimistic change
      fetchBills();
    } finally {
      setPayingId(null);
    }
  };

  /* =========================
     PRINT BILL
  ========================= */
  const printBill = (bill) => {
    const win = window.open("", "", "width=800,height=600");

    win.document.write(`
      <html>
        <head>
          <title>Utility Bill</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #000; padding: 8px; }
          </style>
        </head>
        <body>
          <h2>Utility Management System</h2>
          <table>
            <tr><th>Customer</th><td>${bill.customer_name}</td></tr>
            <tr><th>Utility</th><td>${bill.utility_name}</td></tr>
            <tr><th>Month</th><td>${bill.billing_month}</td></tr>
            <tr><th>Consumption</th><td>${bill.consumption}</td></tr>
            <tr><th>Amount</th><td>${bill.amount}</td></tr>
            <tr><th>Status</th><td>${bill.status}</td></tr>
          </table>
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className="page">
      <Link to="/" className="back-btn">← Back</Link>

      <h2>Bills</h2>

      <div className="card full-width">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Utility</th>
              <th>Month</th>
              <th>Consumption</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No bills found
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.bill_id}>
                  <td>{bill.bill_id}</td>
                  <td>{bill.customer_name}</td>
                  <td>{bill.utility_name}</td>
                  <td>{bill.billing_month}</td>
                  <td>{bill.consumption}</td>
                  <td>{bill.amount}</td>

                  <td>
                    {bill.status === "UNPAID" ? (
                      <button
                        className="mark-paid-btn"
                        disabled={payingId === bill.bill_id}
                        onClick={() => markAsPaid(bill)}
                      >
                        {payingId === bill.bill_id ? "Processing..." : "Mark as Paid"}
                      </button>
                    ) : (
                      <span className="paid-badge">PAID</span>
                    )}
                  </td>

                  <td>
                    <button
                      className="print-btn"
                      onClick={() => printBill(bill)}
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bills;
