import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./common.css"

const utilityOptions = [
  { id: 1, label: "Electricity" },
  { id: 2, label: "Water" },
  { id: 3, label: "Gas" },
]

const getUtilityLabel = (id) =>
  utilityOptions.find((option) => Number(option.id) === Number(id))?.label || "—"

function Meters() {
  const [meters, setMeters] = useState([])
  const [customers, setCustomers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingMeter, setEditingMeter] = useState(null)
  const [form, setForm] = useState({
    meter_number: "",
    customer_id: "",
    utility_id: 1,
    status: "Active",
  })

  const fetchMeters = async () => {
    const res = await axios.get("http://localhost:5000/api/meters")
    setMeters(res.data)
  }

  const fetchCustomers = async () => {
    const res = await axios.get("http://localhost:5000/api/customers")
    setCustomers(res.data)
  }

  useEffect(() => {
    fetchMeters()
    fetchCustomers()
  }, [])

  const openAddModal = () => {
    setEditingMeter(null)
    setForm({
      meter_number: "",
      customer_id: "",
      utility_id: 1,
      status: "Active",
    })
    setShowModal(true)
  }

  const openEditModal = (meter) => {
    setEditingMeter(meter)
    const resolvedCustomerId =
      meter.customer_id !== undefined
        ? String(meter.customer_id)
        : String(customers.find((c) => c.name === meter.customer_name)?.customer_id || "")
    setForm({
      meter_number: meter.meter_number,
      customer_id: resolvedCustomerId,
      utility_id: meter.utility_id || utilityOptions.find((u) => u.label === meter.utility_name)?.id || 1,
      status: meter.status,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingMeter(null)
    setForm({
      meter_number: "",
      customer_id: "",
      utility_id: 1,
      status: "Active",
    })
  }

  const saveMeter = async () => {
    if (!form.meter_number.trim() || !form.customer_id) {
      window.alert("Meter number and customer are required")
      return
    }

    const payload = {
      meter_number: form.meter_number.trim(),
      customer_id: Number(form.customer_id),
      utility_id: Number(form.utility_id),
      status: form.status,
    }

    try {
      if (editingMeter) {
        await axios.put(`http://localhost:5000/api/meters/${editingMeter.meter_id}`, payload)
      } else {
        await axios.post("http://localhost:5000/api/meters", payload)
      }
      closeModal()
      fetchMeters()
    } catch (error) {
      console.error(error)
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save meter. Please try again."
      window.alert(serverMessage)
    }
  }

  const deleteMeter = async (id) => {
    if (!window.confirm("Delete this meter?")) return
    await axios.delete(`http://localhost:5000/api/meters/${id}`)
    fetchMeters()
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
        <button className="add-btn" onClick={openAddModal}>
          ➕ Register connection
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
                <td>{m.customer_name}</td>
                <td>{m.utility_name || getUtilityLabel(m.utility_id)}</td>
                <td>{m.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEditModal(m)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteMeter(m.meter_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingMeter ? "Edit meter" : "Register meter"}</h3>

            <input
              placeholder="Meter number"
              value={form.meter_number}
              onChange={(e) => setForm({ ...form, meter_number: e.target.value })}
            />

            <select
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.customer_id} value={String(customer.customer_id)}>
                  {customer.name}
                </option>
              ))}
            </select>

            <select
              value={String(form.utility_id)}
              onChange={(e) => setForm({ ...form, utility_id: Number(e.target.value) })}
            >
              {utilityOptions.map((option) => (
                <option key={option.id} value={String(option.id)}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <div className="modal-actions">
              <button className="save-btn" onClick={saveMeter}>
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

export default Meters
