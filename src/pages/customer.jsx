import { useEffect, useState } from "react"
import api from "../utils/api"
import { Link } from "react-router-dom"
import "./common.css"

function Customers() {
  const [customers, setCustomers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  const [form, setForm] = useState({
    name: "",
    customer_type: "Household",
    address: "",
    phone: "",
    email: "",
  })

  // FETCH
  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers")
      setCustomers(res.data)
    } catch (err) {
      console.error(err)
      alert("Failed to fetch customers")
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // ADD
  const addCustomer = async () => {
    try {
      await api.post("/customers", form)
      closeModal()
      fetchCustomers()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Failed to add customer")
    }
  }

  // UPDATE
  const updateCustomer = async () => {
    try {
      await api.put(`/customers/${editingCustomer.customer_id}`, form)
      closeModal()
      fetchCustomers()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Failed to update customer")
    }
  }

  // DELETE
 const deleteCustomer = async (id) => {
  if (!window.confirm("Delete this customer?")) return;

  try {
    await api.delete(`/customers/${id}`);
    fetchCustomers(); // ✅ refresh list
  } catch (err) {
    console.error(err);
    alert("Failed to delete customer");
  }
};

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditingCustomer(null)
    setForm({
      name: "",
      customer_type: "Household",
      address: "",
      phone: "",
      email: "",
    })
    setShowModal(true)
  }

  // OPEN EDIT MODAL
  const openEditModal = (customer) => {
    setEditingCustomer(customer)
    setForm(customer)
    setShowModal(true)
  }

  // CLOSE MODAL
  const closeModal = () => {
    setShowModal(false)
    setEditingCustomer(null)
    setForm({
      name: "",
      customer_type: "Household",
      address: "",
      phone: "",
      email: "",
    })
  }

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
        <button className="add-btn" onClick={openAddModal}>
          + Add Customer
        </button>
      </div>

      <h2>Customers</h2>

      {/* TABLE */}
      <div className="card full-width">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
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
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteCustomer(c.customer_id)}
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
            <h3>{editingCustomer ? "Edit Customer" : "Add Customer"}</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              value={form.customer_type}
              onChange={(e) =>
                setForm({ ...form, customer_type: e.target.value })
              }
            >
              <option value="Household">Household</option>
              <option value="Business">Business</option>
              <option value="Government">Government</option>
            </select>

            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

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

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={editingCustomer ? updateCustomer : addCustomer}
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

export default Customers

