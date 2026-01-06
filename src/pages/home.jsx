import { Link } from "react-router-dom"

function Home() {
  return (
    <>
      <div className="page-title">Dashboard</div>

      <div className="card-container">
        <div className="card">
          <h3>Total Customers</h3>
          <p>12</p>
        </div>

        <div className="card">
          <h3>Total Meters</h3>
          <p>8</p>
        </div>

        <div className="card">
          <h3>Unpaid Bills</h3>
          <p>5</p>
        </div>
      </div>
    </>
  )
}

export default Home
