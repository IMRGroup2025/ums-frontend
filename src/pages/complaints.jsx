import { useEffect, useState } from "react"
import axios from "axios"

function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [filter, setFilter] = useState("All")
  const [notes, setNotes] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const fetchComplaints = async () => {
    const res = await axios.get("http://localhost:5000/api/complaints")
    setComplaints(res.data)
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const updateStatus = async (complaint, status) => {
    await axios.put(`http://localhost:5000/api/complaints/${complaint.complaint_id}`, {
      status,
      resolution_notes: notes,
    })
    setSelectedComplaint(null)
    setNotes("")
    fetchComplaints()
  }

  const filteredComplaints = complaints.filter((complaint) =>
    filter === "All" ? true : complaint.status === filter
  )

  return (
    <div className="page">
      <div className="page-header">
        <h2>Complaints</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

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
            {filteredComplaints.map((complaint) => (
              <tr key={complaint.complaint_id}>
                <td>{complaint.complaint_id}</td>
                <td>{complaint.customer_name}</td>
                <td>{complaint.subject}</td>
                <td>{complaint.priority}</td>
                <td>{complaint.status}</td>
                <td>{complaint.updated_at}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update complaint</h3>
            <p>
              {selectedComplaint.subject} • {selectedComplaint.customer_name}
            </p>

            <select
              value={selectedComplaint.status}
              onChange={(e) => setSelectedComplaint({ ...selectedComplaint, status: e.target.value })}
            >
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
            </select>

            <textarea
              placeholder="Resolution notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={() => updateStatus(selectedComplaint, selectedComplaint.status)}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setSelectedComplaint(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Complaints
