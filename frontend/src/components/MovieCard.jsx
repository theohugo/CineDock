import React from "react"
import "./MovieCard.css"


function MovieCard({ title, image, description, rating }) {
  return (
    <div className="movie-card">
      {/* Image du film */}
      <img
        src={image}
        alt={title}
        className="movie-card-image"
      />

      {/* Contenu */}
      <div className="movie-card-content">
        <h3 className="movie-card-title">{title}</h3>

        <p className="movie-card-description">
          {description}
        </p>

        <p className="movie-card-rating">
          ⭐ {rating} / 5
        </p>
      </div>
    </div>
  )
}

export default MovieCard
