import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { movieApi } from "../services/api"
import "./MovieDetails.css"

function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      return
    }

    const controller = new AbortController()
    let isMounted = true

    const fetchMovie = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await movieApi.retrieve(id, controller.signal)
        if (isMounted) {
          setMovie(data)
        }
      } catch (err) {
        if (err.name !== "AbortError" && isMounted) {
          setError(err.message)
          setMovie(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchMovie()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="main-container">
        <p>Chargement du film…</p>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="main-container">
        <h1>Film introuvable</h1>
        {error && <p>Erreur : {error}</p>}
        <Link to="/movies">← Retour aux films</Link>
      </div>
    )
  }

  return (
    <div className="main-container">
      <Link to="/movies" className="back-link">
        ← Retour aux films
      </Link>
      <div className="movie-detail">
        {movie.image ? (
          <img
            src={movie.image}
            alt={movie.name}
            className="movie-detail-image"
          />
        ) : (
          <div className="movie-detail-image placeholder">
            Aucune image disponible
          </div>
        )}

        <div className="movie-detail-content">
          <h1>{movie.name}</h1>
          <p>{movie.description || "Aucune description disponible."}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
