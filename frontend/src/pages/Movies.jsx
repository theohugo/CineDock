import { useEffect, useMemo, useState } from "react"
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

  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    let filtered = movies

    if (normalizedQuery.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.name.toLowerCase().includes(normalizedQuery)
      )
    }

    const sortable = [...filtered]
    if (sortBy === "rating") {
      sortable.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    } else if (sortBy === "recent") {
      sortable.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }

    return sortable
  }, [movies, query, sortBy])

  return (
    <div className="movies-page">
      <header className="movies-hero">
        <div>
          <p className="section-kicker">Catalogue complet</p>
          <h1>Découvrez chaque film, chaque critique</h1>
          <p>Utilisez la recherche et triez par popularité ou date d’ajout.</p>
        </div>

        <div className="movies-filters">
          <input
            type="search"
            placeholder="Rechercher un film..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="popular">Populaires</option>
            <option value="rating">Mieux notés</option>
            <option value="recent">Ajout récent</option>
          </select>
        </div>
      </header>

      <section className="movies-section">
        {isLoading && <p className="movies-feedback">Chargement des films…</p>}

        {error && !isLoading && (
          <p className="movies-feedback error">
            Impossible de charger les films : {error}
          </p>
        )}

        {!isLoading && !error && filteredMovies.length === 0 && (
          <p className="movies-feedback">Aucun film n’est disponible pour le moment.</p>
        )}

        <div className="movies-grid">
          {filteredMovies.map((movie) => (
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

export default Movies
