import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const CategoryPage = () => {
  const { id } = useParams(); 
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=tr-TR`
      )
      .then(res => {
        const genreMap = {};
        res.data.genres.forEach(g => (genreMap[g.id] = g.name));
        setGenres(genreMap);

        if (genreMap[id]) setCategoryName(genreMap[id]);
      });
  }, [API_KEY, id]);

  const fetchMovies = useCallback(() => {
    setLoading(true);
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=tr-TR&with_genres=${id}&page=${page}`
      )
      .then(res => {
        setMovies(prev => [...prev, ...res.data.results]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API_KEY, id, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setPage(prev => prev + 1);
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
      <h1 className="text-white text-3xl font-bold mb-6">
        {categoryName || "Kategori Filmleri"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {movies.map(movie => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-transform cursor-pointer relative"
          >
            <img
              src={IMAGE_BASE_URL + movie.poster_path}
              alt={movie.title}
              className="w-full h-80 object-cover"
            />

            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-yellow-400 px-2 py-1 rounded">
              {"★".repeat(Math.round(movie.vote_average / 2)) +
                "☆".repeat(5 - Math.round(movie.vote_average / 2))}
            </div>

            <div className="p-4">
              <h2 className="text-white text-lg font-semibold mb-2">{movie.title}</h2>

              <div className="flex flex-wrap gap-2">
                {movie.genre_ids.map((gid) => (
                  <span
                    key={gid}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/category/${gid}`);
                    }}
                    className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full cursor-pointer hover:bg-gray-600"
                  >
                    {genres[gid]}
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

export default CategoryPage;
