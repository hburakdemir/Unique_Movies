import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  // Türleri çek
  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=tr-TR`
      )
      .then((res) => {
        const genreMap = {};
        res.data.genres.forEach((g) => (genreMap[g.id] = g.name));
        setGenres(genreMap);
      });
  }, [API_KEY]);

  // Filmleri çek
  const fetchMovies = useCallback(() => {
    setLoading(true);
    axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR&page=${page}`
      )
      .then((res) => {
        setMovies((prev) => [...prev, ...res.data.results]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API_KEY, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (page > 1) fetchMovies();
  }, [page, fetchMovies]);

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <h1 className="text-white text-3xl font-bold mb-6">Popüler Filmler</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-transform cursor-pointer relative"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={IMAGE_BASE_URL + movie.poster_path}
              alt={movie.title}
              className="w-full h-80 object-cover"
            />

            {/* Yıldızlar */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-yellow-400 px-2 py-1 rounded">
              {"★".repeat(Math.round(movie.vote_average / 2)) +
                "☆".repeat(5 - Math.round(movie.vote_average / 2))}
            </div>

            <div className="p-4">
              <h2 className="text-white text-lg font-semibold mb-2">{movie.title}</h2>

              {/* Türler */}
              <div className="flex flex-wrap gap-2">
                {movie.genre_ids.map((id) => (
                  <span
                    key={id}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      navigate(`/genre/${id}`);
                    }}
                    className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full cursor-pointer hover:bg-gray-600"
                  >
                    {genres[id]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-white text-center mt-4">Yükleniyor...</p>}
    </div>
  );
};

export default App;
