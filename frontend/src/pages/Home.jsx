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

  const featuredMovies = movies.slice(0, 4)

  return (
    <div className="main-container">
      {/* Présentation */}
      <section>
        <h1>Bienvenue sur Film Review</h1>
        <p>
          Découvrez des films, consultez des avis et partagez votre opinion avec d’autres passionnés de cinéma.
        </p>
      </section>

      {/* Films populaires */}
      <section className="movies-section">
        <div className="movies-header">
          <h2>Films populaires</h2>

          <Link to="/movies" className="see-all-link">
            Voir tous les films →
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

        <div className="movies-grid">
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
