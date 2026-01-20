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
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState(null)
  const [reviewsVersion, setReviewsVersion] = useState(0)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState(null)
  const [reviewSuccess, setReviewSuccess] = useState(null)

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

  useEffect(() => {
    if (!id) {
      return
    }

    const controller = new AbortController()
    setReviewsLoading(true)
    setReviewsError(null)

    movieApi
      .listReviews(id, controller.signal)
      .then((data) => {
        if (Array.isArray(data?.results)) {
          setReviews(data.results)
        } else {
          setReviews([])
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setReviewsError(err.message)
        }
      })
      .finally(() => {
        setReviewsLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [id, reviewsVersion])

  useEffect(() => {
    if (!user) {
      setReviewRating(5)
      setReviewComment("")
      return
    }

    const existing = reviews.find((review) => review.user?.id === user.id)
    if (existing) {
      setReviewRating(parseFloat(existing.rating) || 0)
      setReviewComment(existing.comment || "")
    } else {
      setReviewRating(5)
      setReviewComment("")
    }
  }, [user, reviews])

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

  const handleReviewRatingChange = (event) => {
    const numericValue = parseFloat(event.target.value)
    if (Number.isNaN(numericValue)) {
      setReviewRating(0)
      return
    }
    setReviewRating(Math.min(5, Math.max(0, numericValue)))
  }

  const handleReviewCommentChange = (event) => {
    setReviewComment(event.target.value)
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

  const handleReviewSubmit = async (event) => {
    event.preventDefault()
    if (!id) {
      return
    }
    if (!token) {
      setReviewError("Vous devez être connecté pour noter ce film.")
      return
    }

    setIsReviewSubmitting(true)
    setReviewError(null)
    setReviewSuccess(null)

    const normalizedRating = Math.min(5, Math.max(0, parseFloat(reviewRating) || 0))

    try {
      await movieApi.submitReview(
        id,
        {
          rating: normalizedRating,
          comment: reviewComment.trim(),
        },
        token
      )
      setReviewSuccess("Merci pour votre avis !")
      setReviewsVersion((version) => version + 1)
      const refreshedMovie = await movieApi.retrieve(id)
      setMovie(refreshedMovie)
    } catch (err) {
      setReviewError(err.message)
    } finally {
      setIsReviewSubmitting(false)
    }
  }

  const formatReviewDate = (value) => {
    if (!value) {
      return ""
    }
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return ""
    }
    return parsed.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatReviewRating = (value) => {
    const numeric = typeof value === "number" ? value : parseFloat(value)
    if (Number.isNaN(numeric)) {
      return "0.0"
    }
    return numeric.toFixed(1)
  }

  const averageRatingDisplay =
    typeof movie?.average_rating === "number" && !Number.isNaN(movie.average_rating)
      ? movie.average_rating.toFixed(1)
      : "N/A"
  const totalReviews = movie?.reviews_count ?? 0

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
          <p className="movie-rating-summary">
            ⭐ {averageRatingDisplay} / 5 · {totalReviews} avis
          </p>

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

      <section className="reviews-section">
        <div className="reviews-header">
          <h2>Avis des spectateurs</h2>
          <p>
            ⭐ {averageRatingDisplay} / 5 · {totalReviews} avis
          </p>
        </div>

        {user ? (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="review-form-row">
              <label htmlFor="review-rating">Note</label>
              <input
                id="review-rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.5"
                value={reviewRating}
                onChange={handleReviewRatingChange}
                disabled={isReviewSubmitting}
              />
            </div>

            <div className="review-form-row">
              <label htmlFor="review-comment">Commentaire (optionnel)</label>
              <textarea
                id="review-comment"
                name="comment"
                rows={4}
                value={reviewComment}
                onChange={handleReviewCommentChange}
                disabled={isReviewSubmitting}
              />
            </div>

            {reviewError && <p className="review-form-message error">{reviewError}</p>}
            {reviewSuccess && <p className="review-form-message success">{reviewSuccess}</p>}

            <button type="submit" disabled={isReviewSubmitting}>
              {isReviewSubmitting ? "Envoi en cours…" : "Publier mon avis"}
            </button>
          </form>
        ) : (
          <p className="review-login-hint">Connectez-vous pour laisser un avis.</p>
        )}

        <div className="reviews-list">
          {reviewsLoading && <p>Chargement des avis…</p>}
          {reviewsError && !reviewsLoading && (
            <p className="review-form-message error">Impossible de charger les avis : {reviewsError}</p>
          )}
          {!reviewsLoading && !reviewsError && reviews.length === 0 && (
            <p>Aucun avis pour le moment.</p>
          )}

          {!reviewsLoading && !reviewsError &&
            reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <div className="review-card-header">
                  <span className="review-author">{review.user?.username || "Utilisateur"}</span>
                  <span className="review-rating">⭐ {formatReviewRating(review.rating)} / 5</span>
                </div>
                {review.comment && <p className="review-comment">{review.comment}</p>}
                <span className="review-date">Mis à jour le {formatReviewDate(review.updated_at)}</span>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}

export default MovieDetails
