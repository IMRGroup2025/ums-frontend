import { Link } from "react-router-dom"
import "./home.css"

function Home() {
  return (
    <div className="home-hero">
      {/* Floating glow elements */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <div className="home-content">
        <h1 className="home-title">
          Utility <span>Management</span> System
        </h1>

        <p className="home-subtitle">
          Smartly manage and monitor your utilities in one place
        </p>

        <div className="home-features">
          <div className="feature-card"> Electricity</div>
          <div className="feature-card"> Water</div>
          <div className="feature-card"> Gas</div>
        </div>

        <Link to="/login" className="home-button">
          Get Started →
        </Link>
      </div>
    </div>
  )
}

export default Home
