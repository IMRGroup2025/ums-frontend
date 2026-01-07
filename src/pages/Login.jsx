import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")

  const navigate = useNavigate()

  const handleLogin = () => {
  if (!username || !password) {
    alert("Please enter username and password")
    return
    }

   navigate("/dashboard")
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Utility Management System</h2>
        <p>Login</p>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Administrative Staff</option>
          <option value="meter">Field Officer / Meter Reader</option>
          <option value="cashier">Cashier / Billing Clerk</option>
          <option value="manager">Manager</option>
        </select>

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}

export default Login
