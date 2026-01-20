import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import MovieCard from "../components/MovieCard"
import { movieApi } from "../services/api"
import "./Movies.css"

function Movies() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const fetchMovies = async () => {
      setIsLoading(true)
      setError(null)

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

  return (
    <div className="main-container">
      <section>
        <h1>Tous les films</h1>
        <p>Explorez l’ensemble des films disponibles sur Film Review.</p>
      </section>

      <section className="movies-section">
        {isLoading && <p className="movies-feedback">Chargement des films…</p>}

        {error && !isLoading && (
          <p className="movies-feedback error">
            Impossible de charger les films : {error}
          </p>
        )}

        {!isLoading && !error && movies.length === 0 && (
          <p className="movies-feedback">Aucun film n’est disponible pour le moment.</p>
        )}

        <div className="movies-grid">
          {movies.map((movie) => (
            <Link
              to={`/movies/${movie.id}`}
              key={movie.id}
              className="movie-card-link"
            >
              <MovieCard
                title={movie.name}
                image={movie.image}
                description={movie.description}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Movies
