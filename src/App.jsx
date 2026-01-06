import { useEffect, useState } from "react"

function App() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({
    name: "",
    customer_type: "Household",
    address: "",
    phone: "",
    email: ""
  })

  // Fetch customers
  const loadCustomers = () => {
    fetch("http://localhost:5000/api/customers")
      .then(res => res.json())
      .then(data => setCustomers(data))
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Submit form
  const handleSubmit = e => {
    e.preventDefault()

    fetch("http://localhost:5000/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(() => {
        setForm({
          name: "",
          customer_type: "Household",
          address: "",
          phone: "",
          email: ""
        })
        loadCustomers()
      })
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Utility Management System</h1>

      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br />
        <select name="customer_type" value={form.customer_type} onChange={handleChange}>
          <option>Household</option>
          <option>Business</option>
          <option>Government</option>
        </select><br />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} /><br />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} /><br />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} /><br />
        <button type="submit">Add Customer</button>
      </form>

      <h2>Customer List</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Type</th><th>Address</th><th>Phone</th><th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.customer_id}>
              <td>{c.customer_id}</td>
              <td>{c.name}</td>
              <td>{c.customer_type}</td>
              <td>{c.address}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
