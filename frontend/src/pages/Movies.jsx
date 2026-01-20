import react from 'react'

import MovieCard from "../components/MovieCard"
import "./Movies.css"

function Movies() {
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
    {
      id: 4,
      title: "Fight Club",
      image: "https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg",
      description: "Un employé de bureau insomniaque fonde un club de combat clandestin.",
      rating: 4.6
    },
    {
      id: 5,
      title: "Forrest Gump",
      image: "https://fr.web.img4.acsta.net/pictures/15/10/13/15/12/514297.jpg",
      description: "La vie extraordinaire d’un homme ordinaire à travers l’histoire américaine.",
      rating: 4.8
    }
  ]

  return (
    <div className="main-container">
      <section>
        <h1>Tous les films</h1>
        <p>Explorez l’ensemble des films disponibles sur Film Review.</p>
      </section>

      <section className="movies-section">
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

export default Movies
