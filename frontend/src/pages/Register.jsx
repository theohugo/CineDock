import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"
import "./Register.css"

const INITIAL_FORM = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
}

const COMMON_PASSWORDS = new Set([
    "password",
    "123456",
    "12345678",
    "qwerty",
    "azerty",
    "motdepasse",
    "password1",
    "111111",
    "000000",
    "abc123",
    "testtest",
])

const validatePasswordRules = ({ password, username, email }) => {
    if (!password || password.length < 8) {
        return "Le mot de passe doit contenir au moins 8 caracteres."
    }

    if (/^\d+$/.test(password)) {
        return "Le mot de passe ne peut pas etre uniquement numerique."
    }

    const normalizedPassword = password.toLowerCase()
    if (COMMON_PASSWORDS.has(normalizedPassword)) {
        return "Ce mot de passe est trop commun."
    }

    const normalizedUsername = username?.trim().toLowerCase()
    if (normalizedUsername && normalizedUsername.length >= 3) {
        if (normalizedPassword.includes(normalizedUsername)) {
            return "Le mot de passe ne doit pas contenir votre identifiant."
        }
    }

    const normalizedEmailLocal = email?.trim().toLowerCase().split("@")[0]
    if (normalizedEmailLocal && normalizedEmailLocal.length >= 3) {
        if (normalizedPassword.includes(normalizedEmailLocal)) {
            return "Le mot de passe ne doit pas reutiliser votre email."
        }
    }

    return null
}

function Register() {
    const navigate = useNavigate()
    const { register: registerUser, isAuthenticating, user } = useAuth()
    const [formData, setFormData] = useState(INITIAL_FORM)
    const [error, setError] = useState(null)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((previous) => ({ ...previous, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError(null)

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.")
            return
        }

        const passwordError = validatePasswordRules({
            password: formData.password,
            username: formData.username,
            email: formData.email,
        })

        if (passwordError) {
            setError(passwordError)
            return
        }

        try {
            await registerUser({
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
            })
            navigate("/", { replace: true })
        } catch (err) {
            setError(err.message)
        }
    }

    if (user) {
        return (
            <div className="main-container">
                <div className="register-card">
                    <h1>Vous êtes déjà inscrit(e)</h1>
                    <p className="register-subtitle">Connecté en tant que {user.username}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="main-container">
            <div className="register-grid">
                <section className="register-hero">
                    <p className="register-super-title">Nouveaux membres</p>
                    <h1>Rejoignez la communauté CinéDock</h1>
                    <p className="register-description">
                        Rédigez des critiques, partagez vos découvertes et débloquez des listes
                        collaboratives. L'inscription est gratuite et l'accès se fait en un instant.
                    </p>
                    <ul className="register-perks">
                        <li>Profil public et avatar cinéma</li>
                        <li>Suivi de vos critiques et notations</li>
                        <li>Listes collaboratives avec vos amis</li>
                    </ul>
                </section>

                <section className="register-card">
                    <h2>Créer mon compte</h2>
                    <p className="register-subtitle">Tous les champs sont requis.</p>
                    <p className="register-hint">Minimum 8 caracteres, evitez les suites communes et les chiffres seuls.</p>
                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="register-name-grid">
                            <label>
                                Prénom
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    autoComplete="given-name"
                                    disabled={isAuthenticating}
                                    required
                                />
                            </label>
                            <label>
                                Nom
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    autoComplete="family-name"
                                    disabled={isAuthenticating}
                                    required
                                />
                            </label>
                        </div>

                        <label>
                            Identifiant
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                autoComplete="username"
                                minLength={3}
                                disabled={isAuthenticating}
                                required
                            />
                        </label>

                        <label>
                            Adresse e-mail
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                disabled={isAuthenticating}
                                required
                            />
                        </label>

                        <div className="register-name-grid">
                            <label>
                                Mot de passe
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    minLength={8}
                                    disabled={isAuthenticating}
                                    required
                                />
                            </label>
                            <label>
                                Confirmation
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    minLength={8}
                                    disabled={isAuthenticating}
                                    required
                                />
                            </label>
                        </div>

                        {error && (
                            <p className="register-error" role="status" aria-live="assertive">
                                {error}
                            </p>
                        )}

                        <button type="submit" disabled={isAuthenticating}>
                            {isAuthenticating ? "Création en cours..." : "Rejoindre CinéDock"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}

export default Register