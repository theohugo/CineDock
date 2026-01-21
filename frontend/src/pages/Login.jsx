import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"
import "./Login.css"

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticating, user } = useAuth()
  const [username, setUsername] = useState("test")
  const [password, setPassword] = useState("test")
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    try {
      await login({ username, password })
      navigate("/", { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  if (user) {
    return (
      <div className="main-container">
        <div className="login-card">
          <h1>Déjà connecté</h1>
          <p>Vous êtes déjà connecté en tant que {user.username}.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="main-container">
      <div className="login-card">
        <h1>Connexion</h1>
        <p className="login-subtitle">Utilisez le compte démo test / test</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Identifiant</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={isAuthenticating}
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isAuthenticating}
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={isAuthenticating}>
            {isAuthenticating ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
