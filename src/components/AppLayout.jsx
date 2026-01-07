import { Outlet, Navigate } from "react-router-dom"
import Sidebar from "./Sidebar"

function AppLayout() {
  const isAuthenticated = true

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
