import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./common.css";

function Tariffs() {
  const [tariffs, setTariffs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTariff, setEditingTariff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    utility: "Electricity",
    rate: "",
    description: "",
  });

  const fetchTariffs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tariff-plans");
      setTariffs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  const openAddModal = () => {
    setEditingTariff(null);
    setError("");
    setForm({
      name: "",
      utility: "Electricity",
      rate: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (tariff) => {
    console.log("EDITING:", tariff);
    setEditingTariff(tariff);
    setError("");
    setForm({
      name: tariff.name,
      utility: tariff.utility,
      rate: tariff.rate,
      description: tariff.description,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTariff(null);
  };

  const saveTariff = async () => {
    if (!form.name || !form.utility) {
      setError("Name and utility are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        rate: Number(form.rate),
      };

      if (editingTariff) {
        await axios.put(
          `http://localhost:5000/api/tariff-plans/${editingTariff.tariff_plan_id}`,
          payload
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/tariff-plans",
          payload
        );
      }

      closeModal();
      fetchTariffs();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save tariff plan");
    } finally {
      setLoading(false);
    }
  };

  const deleteTariff = async (id) => {
    if (!window.confirm("Delete this tariff plan?")) return;

    await axios.delete(`http://localhost:5000/api/tariff-plans/${id}`);
    fetchTariffs();
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
        <button className="add-btn" onClick={openAddModal}>+ Add plan</button>
      </div>

      <h2>Tariff Plans</h2>

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
              <tr key={tariff.tariff_plan_id}>
                <td>{tariff.name}</td>
                <td>{tariff.utility}</td>
                <td>{tariff.rate}</td>
                <td>{tariff.description}</td>
                <td>
                  <button className="btn-edit" onClick={() => openEditModal(tariff)}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteTariff(tariff.tariff_plan_id)}>
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

            {error && <p className="error-text">{error}</p>}

            <input
              value={form.name}
              placeholder="Plan name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              value={form.utility}
              onChange={(e) => setForm({ ...form, utility: e.target.value })}
            >
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Gas">Gas</option>
            </select>

            <input
              type="number"
              placeholder="Rate"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveTariff} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button className="cancel-btn" onClick={closeModal} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tariffs;
