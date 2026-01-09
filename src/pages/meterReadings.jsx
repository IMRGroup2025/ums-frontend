import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./common.css"

function MeterReadings() {
  const [readings, setReadings] = useState([])
  const [meters, setMeters] = useState([])
  const [showModal, setShowModal] = useState(false)

  const emptyForm = {
    meter_id: "",
    current_reading: "",
    reading_date: new Date().toISOString().slice(0, 10),
    reader_name: "",
    notes: ""
  }

  const [form, setForm] = useState(emptyForm)

  /* =========================
     Fetch data
  ========================= */
  const fetchReadings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/meter-readings")
      setReadings(res.data)
    } catch (err) {
      console.error("Fetch readings error:", err)
      // Set empty array if endpoint doesn't exist
      setReadings([])
    }
  }

  const fetchMeters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/meters")
      setMeters(res.data)
    } catch (err) {
      console.error("Fetch meters error:", err)
      setMeters([])
    }
  }

  const markAsPaid = async (bill) => {
  try {
    await axios.post("http://localhost:5000/api/payments", {
      bill_id: bill.bill_id,
      amount: bill.amount,
      payment_method: "Cash"
    });

    fetchBills(); // refresh bills
  } catch (err) {
    console.error("PAYMENT ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to record payment");
  }
};

  useEffect(() => {
    fetchReadings()
    fetchMeters()
  }, [])

  useEffect(() => {
  axios
    .get("http://localhost:5000/api/meter-readings")
    .then(res => setReadings(res.data))
    .catch(err => console.error(err));
}, []);

  /* =========================
     Modal handlers
  ========================= */
  const openModal = () => {
    setForm({ ...emptyForm })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setForm({ ...emptyForm })
  }

  /* =========================
     Save reading
  ========================= */
  const saveReading = async () => {
    if (!form.meter_id || !form.current_reading) {
      alert("Meter and reading value are required")
      return
    }

    if (Number(form.current_reading) <= 0) {
      alert("Reading must be greater than zero")
      return
    }

    const payload = {
      meter_id: Number(form.meter_id),
      current_reading: Number(form.current_reading),
      reading_date: form.reading_date,
      reader_name: form.reader_name,
      notes: form.notes
    }

    try {
      await axios.post("http://localhost:5000/api/meter-readings", payload)
      closeModal()
      fetchReadings()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to save reading")
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">← Back</Link>
        <button className="add-btn" onClick={openModal}>
          + Log reading
        </button>
      </div>

      <h2>Meter Readings</h2>

      <div className="card full-width">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Meter</th>
              <th>Current</th>
              <th>Previous</th>
              <th>Consumption</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {readings.map(r => (
              <tr key={r.reading_id}>
                <td>{r.reading_id}</td>
                <td>{r.meter_number}</td>
                <td>{r.current_reading}</td>
                <td>{r.previous_reading}</td>
                <td>{r.consumption}</td>
                <td>{r.reading_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Log reading</h3>

            <select
              value={form.meter_id}
              onChange={e => setForm({ ...form, meter_id: e.target.value })}
            >
              <option value="">Select meter</option>
              {meters.map(m => (
                <option key={m.meter_id} value={m.meter_id}>
                  {m.meter_number}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Current reading"
              value={form.current_reading}
              onChange={e => setForm({ ...form, current_reading: e.target.value })}
            />

            <input
              type="date"
              value={form.reading_date}
              onChange={e => setForm({ ...form, reading_date: e.target.value })}
            />

            <input
              placeholder="Reader name"
              value={form.reader_name}
              onChange={e => setForm({ ...form, reader_name: e.target.value })}
            />

            <textarea
              placeholder="Notes"
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveReading}>Save</button>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeterReadings
