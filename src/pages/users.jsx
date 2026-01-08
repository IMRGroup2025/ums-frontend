import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./common.css"

function Users() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const [form, setForm] = useState({
    name: "",
    user_type: "ADMINISTRATIVE STAFF",
    phone: "",
    email: "",
    password: "",   
  })

  // FETCH
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users")
    setUsers(res.data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ADD
  const addUser = async () => {
    await axios.post("http://localhost:5000/api/users", form)
    closeModal()
    fetchUsers()
  }

  // UPDATE
  const updateUser = async () => {
    await axios.put(
      `http://localhost:5000/api/users/${editingUser.user_id}`,
      form
    )
    closeModal()
    fetchUsers()
  }

  // DELETE
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return
    await axios.delete(`http://localhost:5000/api/users/${id}`)
    fetchUsers()
  }

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditingUser(null)
    setForm({
      name: "",
      user_type: "ADMINISTRATIVE STAFF",
      phone: "",
      email: "",
      password: "",
    })
    setShowModal(true)
  }

  // OPEN EDIT MODAL
  const openEditModal = (user) => {
    setEditingUser(user)
    setForm(user)
    setShowModal(true)
  }

  // CLOSE MODAL
  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setForm({
      name: "",
      user_type: "Admin Staff",
      phone: "",
      email: "",
      password: "",
    })
  }

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
        <button className="add-btn" onClick={openAddModal}>
          ➕ Add User
        </button>
      </div>

      <h2>Users</h2>
      {/* TABLE */}
      <div className="card full-width">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.user_type}</td>
                <td>{u.phone}</td>
                <td>{u.email}</td>
                <td>{u.password}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(u)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(u.user_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingUser ? "Edit User" : "Add User"}</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              value={form.user_type}
              onChange={(e) =>
                setForm({ ...form, user_type: e.target.value })
              }
            >
              <option value="ADMINISTRATIVE STAFF">ADMINISTRATIVE STAFF</option>
              <option value="FIELD OFFICERS">FIELD OFFICERS</option>
              <option value="CASHIERS">CASHIERS</option>
              <option value="MANAGERS">MANAGERS</option>
            </select>

            
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={editingUser ? updateUser : addUser}
              >
                Save
              </button>
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
