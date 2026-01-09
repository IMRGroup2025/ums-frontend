import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      switch (res.data.user_type) {
        case "SUPER ADMIN":
        case "ADMINISTRATIVE STAFF":
          navigate("/dashboard");
          break;
        case "FIELD OFFICERS":
          navigate("/meter-readings");
          break;
        case "CASHIERS":
          navigate("/bills");
          break;
        case "MANAGERS":
          navigate("/reports");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Utility Management System</h2>

        {error && <div className="error">{error}</div>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
