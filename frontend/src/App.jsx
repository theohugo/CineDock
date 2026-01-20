import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Les pages
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import MovieDetails from "./pages/MovieDetails"
import Login from "./pages/Login"
import Register from "./pages/Register"

// Les components
import Navbar from "./components/Navbar"

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App