import { Outlet } from "react-router-dom"
import TopBar from "./TopBar"
import BottomNav from "./BottomNav"
import "./AppLayout.css"

const AppLayout = ({ isLoggedIn }) => {
  return (
    <div className="app-layout">
      <TopBar isLoggedIn={isLoggedIn} />
      <div className="app-layout-content">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

export default AppLayout