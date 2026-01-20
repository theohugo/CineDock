import React from "react"
import { Link } from "react-router-dom"
import './Navbar.css'

function Navbar() {
  return (
    <nav>
      <div>
        {/* Titre cliquable */}
        <Link to="/">
          <h1>Ciné Dock</h1>
        </Link>
      </div>

      <div>
        {/* Boutons navigation */}
        <Link to="/login">Connexion</Link>
        <Link to="/register">Inscription</Link>
      </div>
    </nav>
  )
}

export default Navbar
