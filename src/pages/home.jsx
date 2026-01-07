import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="home-container">
      <h1>Utility Management System</h1>
      <p>Electricity • Water • Gas</p>

      <Link to="/login" className="login-btn">
        Login
      </Link>
    </div>
  )
}

export default Home

