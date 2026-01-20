import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"
import { movieApi } from "../services/api"
import "./MovieDetails.css"

function MovieDetails() {
  const { id } = useParams()
  const { user, token } = useAuth()
  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formValues, setFormValues] = useState({ name: "", description: "", image: null })
  const [previewImage, setPreviewImage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(null)

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

  useEffect(() => {
    if (movie) {
      setFormValues({
        name: movie.name || "",
        description: movie.description || "",
        image: null,
      })
      setPreviewImage(null)
    }
  }, [movie])

  const enableEditing = () => {
    setSaveError(null)
    setSaveSuccess(null)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setFormValues({
      name: movie?.name || "",
      description: movie?.description || "",
      image: null,
    })
    setPreviewImage(null)
    setSaveError(null)
    setSaveSuccess(null)
    setIsEditing(false)
  }

  const handleInputChange = (event) => {
    const { name, value, files } = event.target

    if (name === "image" && files) {
      const file = files[0] || null
      setFormValues((prev) => ({
        ...prev,
        image: file,
      }))
      if (file) {
        setPreviewImage(URL.createObjectURL(file))
      } else {
        setPreviewImage(null)
      }
      return
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!id) {
      return
    }
    if (!token) {
      setSaveError("Vous devez être connecté pour modifier un film.")
      return
    }

    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(null)

    const payload = new FormData()
    payload.append("name", formValues.name.trim())
    payload.append("description", formValues.description.trim())
    if (formValues.image) {
      payload.append("image", formValues.image)
    }

    try {
      const updatedMovie = await movieApi.update(id, payload, token)
      setMovie(updatedMovie)
      setIsEditing(false)
      setPreviewImage(null)
      setSaveSuccess("Le film a été mis à jour avec succès.")
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

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
        {previewImage || movie.image ? (
          <img
            src={previewImage || movie.image}
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

          {user && (
            <div className="movie-edit-section">
              {saveSuccess && !isEditing && (
                <p className="movie-edit-message success">{saveSuccess}</p>
              )}

              {!isEditing ? (
                <button type="button" className="movie-edit-button" onClick={enableEditing}>
                  Modifier le film
                </button>
              ) : (
                <form className="movie-edit-form" onSubmit={handleSubmit}>
                  <label htmlFor="movie-name">Titre</label>
                  <input
                    id="movie-name"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    required
                  />

                  <label htmlFor="movie-description">Description</label>
                  <textarea
                    id="movie-description"
                    name="description"
                    rows={6}
                    value={formValues.description}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />

                  <label htmlFor="movie-image">Image</label>
                  <input
                    id="movie-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />

                  {saveError && <p className="movie-edit-message error">{saveError}</p>}

                  <div className="movie-edit-actions">
                    <button type="button" className="movie-edit-cancel" onClick={cancelEditing} disabled={isSaving}>
                      Annuler
                    </button>
                    <button type="submit" className="movie-edit-submit" disabled={isSaving}>
                      {isSaving ? "Enregistrement…" : "Enregistrer"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
