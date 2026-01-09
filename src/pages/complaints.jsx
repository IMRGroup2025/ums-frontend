import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./common.css";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [createForm, setCreateForm] = useState({
    customer_name: "",
    subject: "",
    priority: "Medium",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    const res = await axios.get("http://localhost:5000/api/complaints");
    setComplaints(res.data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const submitComplaint = async () => {
    if (!createForm.customer_name || !createForm.subject) {
      setError("Customer and subject are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/complaints", createForm);
      setShowCreateModal(false);
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/complaints/${id}`, { status });
    fetchComplaints();
  };

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter((c) => c.status === filter);

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
        <div className="header-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <button className="add-btn" onClick={() => setShowCreateModal(true)}>
            + Make a complaint
          </button>
        </div>
      </div>

      <h2>Complaints</h2>

      <div className="card full-width">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Last updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((c) => (
              <tr key={c.complaint_id}>
                <td>{c.complaint_id}</td>
                <td>{c.customer_name}</td>
                <td>{c.subject}</td>
                <td>{c.priority}</td>
                <td>{c.status}</td>
                <td>{new Date(c.last_updated).toLocaleString()}</td>
                <td>
                  <select
                    className="status-select"
                    value={c.status}
                    onChange={(e) => updateStatus(c.complaint_id, e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Make a complaint</h3>
            {error && <p className="error-text">{error}</p>}

            <input
              placeholder="Customer name"
              value={createForm.customer_name}
              onChange={(e) =>
                setCreateForm({ ...createForm, customer_name: e.target.value })
              }
            />

            <input
              placeholder="Subject"
              value={createForm.subject}
              onChange={(e) =>
                setCreateForm({ ...createForm, subject: e.target.value })
              }
            />

            <select
              value={createForm.priority}
              onChange={(e) =>
                setCreateForm({ ...createForm, priority: e.target.value })
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <textarea
              placeholder="Description"
              rows={4}
              value={createForm.description}
              onChange={(e) =>
                setCreateForm({ ...createForm, description: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={submitComplaint} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Complaints;
