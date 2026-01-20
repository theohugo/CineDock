import react from 'react'
import { Link } from "react-router-dom"
import MovieCard from "../components/MovieCard"
import './Home.css'

function Home() {
  const movies = [
    {
      id: 1,
      title: "Inception",
      image: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg",
      description: "Un voleur spécialisé dans l’extraction de rêves se voit confier une mission impossible.",
      rating: 4.8
    },
    {
      id: 2,
      title: "Interstellar",
      image: "https://fr.web.img5.acsta.net/c_310_420/pictures/14/09/24/12/08/158828.jpg",
      description: "Un voyage à travers l’espace et le temps pour sauver l’humanité.",
      rating: 4.9
    },
    {
      id: 3,
      title: "The Dark Knight",
      image: "https://fr.web.img2.acsta.net/medias/nmedia/18/63/97/89/18949761.jpg",
      description: "Batman affronte le Joker, un criminel prêt à plonger Gotham dans le chaos.",
      rating: 4.7
    },
    
  ]

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

        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              image={movie.image}
              description={movie.description}
              rating={movie.rating}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
