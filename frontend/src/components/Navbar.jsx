import React from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"
import "./Navbar.css"

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav>
      <div>
        <Link to="/">
          <h1>Ciné Dock</h1>
        </Link>
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">Bonjour, {user.username}</span>
            <button type="button" className="navbar-logout" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button">
              Connexion
            </Link>
            <Link to="/register" className="navbar-button">
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
