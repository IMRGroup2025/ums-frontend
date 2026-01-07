import { useEffect, useState } from "react"
import axios from "axios"

function MeterReadings() {
  const [readings, setReadings] = useState([])
  const [meters, setMeters] = useState([])
  const [showModal, setShowModal] = useState(false)
  const emptyForm = {
    meter_id: "",
    reading_value: "",
    reading_date: new Date().toISOString().slice(0, 10),
    reader_name: "",
    notes: "",
  }

  const [form, setForm] = useState(emptyForm)

  const fetchReadings = async () => {
    const res = await axios.get("http://localhost:5000/api/meter-readings")
    setReadings(res.data)
  }

  const fetchMeters = async () => {
    const res = await axios.get("http://localhost:5000/api/meters")
    setMeters(res.data)
  }

  useEffect(() => {
    fetchReadings()
    fetchMeters()
  }, [])

  const openModal = () => {
    setForm({ ...emptyForm, reading_date: new Date().toISOString().slice(0, 10) })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setForm({ ...emptyForm, reading_date: new Date().toISOString().slice(0, 10) })
  }

  const saveReading = async () => {
    if (!form.meter_id || !form.reading_value.trim()) {
      window.alert("Meter and reading value are required")
      return
    }

    if (Number(form.reading_value) <= 0) {
      window.alert("Reading value must be greater than zero")
      return
    }

    const selectedMeter = meters.find(
      (meter) => Number(meter.meter_id) === Number(form.meter_id)
    )

    if (!selectedMeter) {
      window.alert("Selected meter could not be found. Please refresh and try again.")
      return
    }

    const payload = {
      meter_id: Number(form.meter_id),
      customer_id: Number(selectedMeter.customer_id),
      utility_id: Number(selectedMeter.utility_id),
      reading_value: Number(form.reading_value),
      reading_date: form.reading_date,
      reader_name: form.reader_name,
      notes: form.notes,
    }

    try {
      await axios.post("http://localhost:5000/api/meter-readings", payload)
      closeModal()
      fetchReadings()
    } catch (error) {
      console.error(error)
      const responseBody = error.response?.data
      const serverMessage =
        (typeof responseBody === "string" && responseBody) ||
        responseBody?.message ||
        responseBody?.error ||
        (responseBody ? JSON.stringify(responseBody) : null) ||
        error.message ||
        "Failed to save reading. Please try again."
      window.alert(serverMessage)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Meter readings</h2>
        <button className="add-btn" onClick={openModal}>
          + Log reading
        </button>
      </div>

      <div className="card full-width">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Meter</th>
              <th>Utility</th>
              <th>Reading</th>
              <th>Date</th>
              <th>Reader</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {readings.map((reading) => (
              <tr key={reading.reading_id}>
                <td>{reading.reading_id}</td>
                <td>{reading.meter_number}</td>
                <td>{reading.utility_name}</td>
                <td>{reading.reading_value}</td>
                <td>{reading.reading_date}</td>
                <td>{reading.reader_name}</td>
                <td>{reading.notes || "—"}</td>
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
              onChange={(e) => setForm({ ...form, meter_id: e.target.value })}
            >
              <option value="">Select meter</option>
              {meters.map((meter) => (
                <option key={meter.meter_id} value={meter.meter_id}>
                  {meter.meter_number} • {meter.utility_name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Reading value"
              value={form.reading_value}
              onChange={(e) => setForm({ ...form, reading_value: e.target.value })}
            />

            <input
              type="date"
              value={form.reading_date}
              onChange={(e) => setForm({ ...form, reading_date: e.target.value })}
            />

            <input
              placeholder="Reader name"
              value={form.reader_name}
              onChange={(e) => setForm({ ...form, reader_name: e.target.value })}
            />

            <textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveReading}>
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

export default MeterReadings
