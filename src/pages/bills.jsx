import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "./common.css";

function Bills() {
  const [bills, setBills] = useState([]);
  const [payingId, setPayingId] = useState(null);

  const fetchBills = async () => {
    try {
      const res = await api.get("/bills");
      setBills(res.data);
    } catch (err) {
      console.error("FETCH BILLS ERROR:", err);
      alert("Failed to load bills");
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const markAsPaid = async (bill) => {
    if (bill.status === "PAID") return;

    try {
      setPayingId(bill.bill_id);

      // Optimistic UI update
      setBills((curr) =>
        curr.map((b) =>
          b.bill_id === bill.bill_id ? { ...b, status: "PAID" } : b
        )
      );

      await api.put(`/bills/${bill.bill_id}/pay`);
      await fetchBills();
    } catch (err) {
      console.error("PAYMENT ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to record payment");
      // Revert optimistic change
      fetchBills();
    } finally {
      setPayingId(null);
    }
  };

  const printBill = (bill) => {
    const win = window.open("", "", "width=900,height=700");

    win.document.write(`
      <html>
        <head>
          <title>Utility Bill - ${bill.bill_id}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px;
              background: #f5f6fb;
            }
            .bill-container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              margin: 0 auto;
            }
            h2 { 
              text-align: center; 
              color: #212a35;
              margin-bottom: 30px;
              font-size: 28px;
            }
            .bill-details {
              margin: 30px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
              font-size: 16px;
            }
            .detail-label {
              font-weight: 600;
              color: #667eea;
            }
            .detail-value {
              color: #374151;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .amount-section {
              background: #f0f9ff;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              text-align: center;
            }
            .total-amount {
              font-size: 32px;
              font-weight: 700;
              color: #22c55e;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-top: 20px;
            }
            .status-paid {
              background: #dcfce7;
              color: #15803d;
            }
            .status-unpaid {
              background: #fee2e2;
              color: #991b1b;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              color: #9ca3af;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <h2>⚡ Utility Bill</h2>
            
            <div class="bill-details">
              <div class="detail-row">
                <span class="detail-label">Bill ID</span>
                <span class="detail-value">#${bill.bill_id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Customer</span>
                <span class="detail-value">${bill.customer_name || bill.customer}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Utility Type</span>
                <span class="detail-value">${bill.utility_name || bill.utility}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Billing Month</span>
                <span class="detail-value">${bill.billing_month || bill.month}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Consumption</span>
                <span class="detail-value">${bill.consumption} Units</span>
              </div>
            </div>

            <div class="amount-section">
              <div class="total-amount">Rs. ${parseFloat(bill.amount).toFixed(2)}</div>
              <div style="color: #6b7280; margin-top: 8px;">Total Amount Due</div>
            </div>

            <div style="text-align: center;">
              <span class="status-badge status-${bill.status === 'PAID' ? 'paid' : 'unpaid'}">
                ${bill.status}
              </span>
            </div>

            <div class="footer">
              <p>Utility Management System - Generated on ${new Date().toLocaleDateString()}</p>
              <p>For inquiries, please contact customer service</p>
            </div>
          </div>
        </body>
      </html>
    `);

    win.document.close();
    setTimeout(() => win.print(), 250);
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
        <div className="header-actions">
        </div>
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
              <th>Consumption</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "24px" }}>
                  <p style={{ color: "#9ca3af" }}>No bills found</p>
                </td>
              </tr>
            ) : (
              bills.map(b => (
                <tr key={b.bill_id}>
                  <td>{b.bill_id}</td>
                  <td>{b.customer_name || b.customer}</td>
                  <td>{b.utility_name || b.utility}</td>
                  <td>{b.billing_month}</td>
                  <td>{b.consumption}</td>
                  <td style={{ fontWeight: "700", color: "#212a35" }}>Rs. {parseFloat(b.amount).toFixed(2)}</td>
                  <td>
                    {b.status === "PAID" ? (
                      <span className={`status paid`}>
                        {b.status}
                      </span>
                    ) : (
                      <button 
                        className="mark-paid-btn"
                        disabled={payingId === b.bill_id}
                        onClick={() => markAsPaid(b)}
                        style={{
                          opacity: payingId === b.bill_id ? 0.6 : 1,
                          cursor: payingId === b.bill_id ? "not-allowed" : "pointer"
                        }}
                      >
                        {payingId === b.bill_id ? " Processing..." : " Mark as Paid"}
                      </button>
                    )}
                  </td>
                  <td>
                    <button 
                      className="print-btn"
                      onClick={() => printBill(b)}
                      title="Print bill"
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
