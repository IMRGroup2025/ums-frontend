import { useEffect, useState } from "react"
import axios from "axios"

function Tariffs() {
  const [tariffs, setTariffs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingTariff, setEditingTariff] = useState(null)
  const [form, setForm] = useState({
    name: "",
    utility_type: "Electricity",
    rate: "",
    description: "",
  })

  const fetchTariffs = async () => {
    const res = await axios.get("http://localhost:5000/api/tariffs")
    setTariffs(res.data)
  }

  useEffect(() => {
    fetchTariffs()
  }, [])

  const openAddModal = () => {
    setEditingTariff(null)
    setForm({ name: "", utility_type: "Electricity", rate: "", description: "" })
    setShowModal(true)
  }

  const openEditModal = (tariff) => {
    setEditingTariff(tariff)
    setForm({
      name: tariff.name,
      utility_type: tariff.utility_type,
      rate: tariff.rate,
      description: tariff.description,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTariff(null)
  }

  const saveTariff = async () => {
    if (editingTariff) {
      await axios.put(`http://localhost:5000/api/tariffs/${editingTariff.tariff_id}`, form)
    } else {
      await axios.post("http://localhost:5000/api/tariffs", form)
    }
    closeModal()
    fetchTariffs()
  }

  const deleteTariff = async (id) => {
    if (!window.confirm("Delete this tariff plan?")) return
    await axios.delete(`http://localhost:5000/api/tariffs/${id}`)
    fetchTariffs()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tariff plans</h2>
        <button className="add-btn" onClick={openAddModal}>
          + Add plan
        </button>
      </div>

      <div className="card full-width">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Utility</th>
              <th>Rate</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tariffs.map((tariff) => (
              <tr key={tariff.tariff_id}>
                <td>{tariff.name}</td>
                <td>{tariff.utility_type}</td>
                <td>{tariff.rate}</td>
                <td>{tariff.description}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEditModal(tariff)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteTariff(tariff.tariff_id)}>
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
            <h3>{editingTariff ? "Edit plan" : "New plan"}</h3>

            <input
              placeholder="Plan name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              value={form.utility_type}
              onChange={(e) => setForm({ ...form, utility_type: e.target.value })}
            >
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Gas">Gas</option>
            </select>

            <input
              type="number"
              placeholder="Rate (per unit)"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
            />

            <textarea
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveTariff}>
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

export default Tariffs
