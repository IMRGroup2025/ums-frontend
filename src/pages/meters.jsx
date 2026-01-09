import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./common.css";

function Meters() {
  const [meters, setMeters] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [utilities, setUtilities] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    meter_number: "",
    installation_date: "",
    customer_id: "",
    utility_id: "",
    status: "Active",
  });

  /* =========================
     FETCH DATA
  ========================= */
  const fetchMeters = async () => {
    const res = await axios.get("http://localhost:5000/api/meters");
    setMeters(res.data);
  };

  const fetchCustomers = async () => {
    const res = await axios.get("http://localhost:5000/api/customers");
    setCustomers(res.data);
  };

  const fetchUtilities = async () => {
    const res = await axios.get("http://localhost:5000/api/utilities");
    setUtilities(res.data);
  };

  useEffect(() => {
    fetchMeters();
    fetchCustomers();
    fetchUtilities();
  }, []);

  // Build a deduplicated utility list with only ELECTRICITY, WATER, GAS
  const allowedUtilityNames = ["ELECTRICITY", "WATER", "GAS"];
  const seenUtilities = new Set();
  const utilityOptions = [];
  utilities.forEach((u) => {
    const nameUpper = String(u.utility_name).toUpperCase();
    if (allowedUtilityNames.includes(nameUpper) && !seenUtilities.has(nameUpper)) {
      seenUtilities.add(nameUpper);
      utilityOptions.push(u);
    }
  });

  /* =========================
     MODAL HANDLERS
  ========================= */
  const openModal = () => {
    setForm({
      meter_number: "",
      installation_date: "",
      customer_id: "",
      utility_id: "",
      status: "Active",
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  /* =========================
     SAVE METER
  ========================= */
  const saveMeter = async () => {
    if (!form.customer_id || !form.utility_id) {
      setError("Customer and Utility are required");
      return;
    }

    try {
      console.log("Sending meter data:", form);
      const response = await axios.post("http://localhost:5000/api/meters", {
        meter_number: form.meter_number,
        installation_date: form.installation_date,
        customer_id: parseInt(form.customer_id),
        utility_id: parseInt(form.utility_id),
        status: form.status
      });
      console.log("Meter created:", response.data);
      closeModal();
      fetchMeters();
    } catch (err) {
      console.error("Save meter error:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to add meter");
    }
  };

  /* =========================
     DELETE METER
  ========================= */
  const deleteMeter = async (id) => {
    if (!window.confirm("Delete this meter?")) return;
    await axios.delete(`http://localhost:5000/api/meters/${id}`);
    fetchMeters();
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
        <button className="add-btn" onClick={openModal}>
          + Register Meter
        </button>
      </div>

      <h2>Meters</h2>

      <div className="card full-width">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Meter Number</th>
              <th>Customer</th>
              <th>Utility</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meters.map((m) => (
              <tr key={m.meter_id}>
                <td>{m.meter_id}</td>
                <td>{m.meter_number}</td>
                <td>{m.customer_name} (ID: {m.customer_id})</td>
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

      {/* =========================
          MODAL
      ========================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Register Meter</h3>

            {error && <p className="error-text">{error}</p>}

            <input
              placeholder="Meter number"
              value={form.meter_number}
              onChange={(e) =>
                setForm({ ...form, meter_number: e.target.value })
              }
            />

            <input
              type="date"
              value={form.installation_date}
              onChange={(e) =>
                setForm({ ...form, installation_date: e.target.value })
              }
            />

            {/* CUSTOMER */}
            <select
              value={form.customer_id}
              onChange={(e) =>
                setForm({ ...form, customer_id: e.target.value })
              }
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.name} (ID: {c.customer_id})
                </option>
              ))}
            </select>

            {/* UTILITY */}
            <select
              value={form.utility_id}
              onChange={(e) =>
                setForm({ ...form, utility_id: e.target.value })
              }
            >
              <option value="">Select utility</option>
              {utilityOptions.map((u) => (
                <option key={u.utility_id} value={u.utility_id}>
                  {u.utility_name}
                </option>
              ))}
            </select>

            {/* STATUS */}
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="modal-actions">
              <button className="save-btn" onClick={saveMeter}>Save</button>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Meters;
