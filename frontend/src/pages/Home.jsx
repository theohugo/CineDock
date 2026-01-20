import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import MovieCard from "../components/MovieCard"
import { movieApi } from "../services/api"
import "./Home.css"

function Home() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const fetchMovies = async () => {
      try {
        const data = await movieApi.list(controller.signal)
        if (isMounted) {
          setMovies(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (err.name !== "AbortError" && isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchMovies()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  const featuredMovies = movies.slice(0, 6)

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-kicker">Ciné Dock • Catalogue & Avis</p>
          <h1>
            Explorez, notez et partagez votre passion pour le <span>cinéma</span>.
          </h1>
          <p>
            Une selection constamment mise à jour, des critiques authentiques et une expérience pensée pour les cinéphiles.
          </p>

          <div className="hero-actions">
            <Link to="/movies" className="hero-primary">
              Explorer le catalogue
            </Link>
            <button type="button" className="hero-secondary">
              Voir les tendances
            </button>
          </div>
        </div>

        <div className="hero-highlight">
          <div className="hero-highlight-card">
            <p className="hero-highlight-label">Avis partagés</p>
            <h3>4.8 / 5</h3>
            <p>Basé sur les notes des passionnés CineDock</p>
          </div>
          <div className="hero-highlight-card">
            <p className="hero-highlight-label">Films disponibles</p>
            <h3>{movies.length || "—"}</h3>
            <p>Ajouts hebdomadaires & coups de cœur</p>
          </div>
        </div>
      </section>

      <section className="spotlight">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Sélection des critiques</p>
            <h2>Films populaires</h2>
          </div>

          <Link to="/movies" className="see-all-link">
            Voir toute la sélection →
          </Link>
        </div>

        {isLoading && (
          <p className="movies-feedback">Chargement des films…</p>
        )}

        {error && !isLoading && (
          <p className="movies-feedback error">
            Impossible de charger les films : {error}
          </p>
        )}

        {!isLoading && !error && featuredMovies.length === 0 && (
          <p className="movies-feedback">Aucun film n’est disponible pour le moment.</p>
        )}

        <div className="spotlight-grid">
          {featuredMovies.map((movie) => (
            <Link
              to={`/movies/${movie.id}`}
              key={movie.id}
              className="movie-card-link"
            >
              <MovieCard
                title={movie.name}
                image={movie.image}
                description={movie.description}
                rating={movie.average_rating}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
