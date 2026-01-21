import React from "react"
import "./MovieCard.css"

const buildDescription = (description) => {
  const fallback = description && description.trim().length > 0
    ? description.trim()
    : "Aucune description disponible."

  if (fallback.length <= 180) {
    return fallback
  }

  return `${fallback.slice(0, 177)}…`
}

const normalizeRating = (rating) => {
  const numericRating = typeof rating === "number" ? rating : Number(rating)
  return Number.isFinite(numericRating) ? numericRating : null
}

function MovieCard({ title, image, description, rating }) {
  const formattedDescription = buildDescription(description || "")
  const normalizedRating = normalizeRating(rating)

  return (
    <div className="movie-card">
      {image ? (
        <img src={image} alt={title} className="movie-card-image" />
      ) : (
        <div className="movie-card-placeholder">Image indisponible</div>
      )}

      <div className="movie-card-content">
        <h3 className="movie-card-title">{title}</h3>

        <p className="movie-card-description">{formattedDescription}</p>

        {normalizedRating !== null && (
          <p className="movie-card-rating">
            <span>⭐ {normalizedRating.toFixed(1)}</span>
            <span className="movie-card-rating-badge">Note</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default MovieCard
