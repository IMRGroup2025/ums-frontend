import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./common.css";

function MeterReadings() {
  const navigate = useNavigate();
  const [meters, setMeters] = useState([]);
  const [groupedReadings, setGroupedReadings] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [generatedBillId, setGeneratedBillId] = useState(null);

  const emptyForm = {
    meter_id: "",
    current_reading: "",
    reading_date: new Date().toISOString().slice(0, 10)
  };

  const [form, setForm] = useState(emptyForm);

  /* =========================
     FETCH DATA
  ========================= */
  const fetchMeters = async () => {
    const res = await api.get("/meters");
    setMeters(res.data);
  };

  const fetchReadings = async () => {
    const res = await api.get("/meter-readings/grouped");
    setGroupedReadings(res.data || {});
  };

  useEffect(() => {
    fetchMeters();
    fetchReadings();
  }, []);

  /* =========================
     SAVE READING
  ========================= */
  const saveReading = async () => {
    if (!form.meter_id || !form.current_reading) {
      setError("Please fill all fields");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const response = await api.post("/meter-readings", {
        meter_id: Number(form.meter_id),
        current_reading: Number(form.current_reading),
        reading_date: form.reading_date
      });

      // Extract bill data from response (status 201)
      const billData = response.data?.bill;
      
      if (billData) {
        setGeneratedBillId(billData.bill_id);
        setMessage(
          `✓ Meter reading saved! Bill #${billData.bill_id} generated: Rs. ${parseFloat(billData.amount).toFixed(2)} (${billData.consumption} units)`
        );
      } else {
        setGeneratedBillId(null);
        setMessage("Meter reading added successfully");
      }
      
      setTimeout(() => {
        setMessage("");
        setGeneratedBillId(null);
      }, 8000);
      setError("");
      setForm(emptyForm);
      setShowForm(false);
      fetchReadings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
      setTimeout(() => setError(""), 4000);
    }
  };

  /* =========================
     DELETE READING
  ========================= */
  const deleteReading = async (id) => {
    if (!confirm("Are you sure you want to delete this reading?")) {
      return;
    }

    try {
      await api.delete(`/meter-readings/${id}`);
      setMessage("Reading deleted successfully");
      setTimeout(() => setMessage(""), 3000);
      setError("");
      fetchReadings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete reading");
      setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Meter Reading
          </button>
        </div>
      </div>

      {(message || error) && (
        <div style={{
          marginBottom: "16px",
          padding: "14px 18px",
          borderRadius: "12px",
          background: message
            ? "linear-gradient(135deg, rgba(50, 172, 109, 0.12), rgba(52, 211, 153, 0.12))"
            : "linear-gradient(135deg, rgba(248, 113, 113, 0.15), rgba(239, 68, 68, 0.15))",
          color: message ? "#065f46" : "#991b1b",
          border: message
            ? "1px solid rgba(52, 211, 153, 0.4)"
            : "1px solid rgba(248, 113, 113, 0.45)",
          fontWeight: 600,
          fontSize: "15px",
          lineHeight: "1.6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px"
        }}>
          <span>{message || error}</span>
          {generatedBillId && (
            <button
              onClick={() => navigate('/bills')}
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                color: "#059669",
                border: "1.5px solid #10b981",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#ecfdf5";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#ffffff";
                e.target.style.transform = "translateY(0)";
              }}
            >
              View Bill →
            </button>
          )}
        </div>
      )}

      <h2>Meter Readings</h2>

      {(() => {
        const priorityOrder = ["ELECTRICITY", "WATER", "GAS"]; // ensures consistent ordering
        const orderedPriority = priorityOrder.map((name) => [name, groupedReadings?.[name] || []]);

        const remaining = Object.entries(groupedReadings || {})
          .filter(([name]) => !priorityOrder.includes(String(name).toUpperCase()));

        const sections = [...orderedPriority, ...remaining];

        return sections.map(([utilityName, readings]) => (
          <div key={utilityName} className="card full-width" style={{ marginBottom: "24px" }}>
            <h3 style={{
              margin: "0 0 20px 0",
              color: "#6366f1",
              fontSize: "20px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              {utilityName} Meter Readings
            </h3>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Meter</th>
                  <th>Current</th>
                  <th>Previous</th>
                  <th>Consumption</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(!readings || readings.length === 0) ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "18px", color: "#9ca3af" }}>
                      No readings yet for this utility
                    </td>
                  </tr>
                ) : (
                  readings.map((r) => (
                    <tr key={r.reading_id}>
                      <td>{r.reading_id}</td>
                      <td>{r.meter_number}</td>
                      <td>{r.current_reading}</td>
                      <td>{r.previous_reading}</td>
                      <td>{r.consumption}</td>
                      <td>{new Date(r.reading_date).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => deleteReading(r.reading_id)}
                          title="Delete reading"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ));
      })()}

      {/* FORM MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Meter Reading</h3>

            <select
              value={form.meter_id}
              onChange={e => setForm({ ...form, meter_id: e.target.value })}
            >
              <option value="">Select Meter</option>
              {meters.map(m => (
                <option key={m.meter_id} value={m.meter_id}>
                  {m.meter_number}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Current Reading"
              value={form.current_reading}
              onChange={e =>
                setForm({ ...form, current_reading: e.target.value })
              }
            />

            <input
              type="date"
              value={form.reading_date}
              onChange={e =>
                setForm({ ...form, reading_date: e.target.value })
              }
            />

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button 
                onClick={saveReading}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  background: "linear-gradient(135deg, #32a95c 0%, #3daf69 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 28px rgba(102, 126, 234, 0.45)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.3)";
                }}
              >
                ✓ Save
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm(emptyForm);
                }}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e5e7eb";
                  e.target.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#f3f4f6";
                  e.target.style.borderColor = "#e5e7eb";
                }}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeterReadings;
