import { Link } from "react-router-dom"

const TopBar = ({ isLoggedIn }) => {
  
    const handleLogout = () => {
    sessionStorage.removeItem("hobbyhubLoggedIn")
    window.location.href = "/login"
  }
  return (
    <header className="top-bar">
      <Link to="/feed" className="top-bar-brand">
        HobbyHub
      </Link>
      <div className="top-bar-actions">
      <Link to="/chat" className="top-bar-chat">
        Chat
      </Link>
      
      {isLoggedIn ? (
        <button
          type="button"
          className="top-bar-login"
          onClick={handleLogout}
        >
          Log Out
        </button>
      ) : (
        <Link to="/login" className="top-bar-login">
          Log In
        </Link>
      )}
      </div>
    </header>
  )
}

export default TopBar