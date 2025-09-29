import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Tv = () => {
  const [tvShows, setTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  const fetchTVShows = useCallback(() => {
    setLoading(true);
    axios
      .get(
        `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=tr-TR&page=${page}`
      )
      .then((res) => {
        setTvShows((prev) => [...prev, ...res.data.results]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API_KEY, page]);

  useEffect(() => {
    fetchTVShows();
  }, [fetchTVShows]);

  // infinite scrollmuş
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
    if (page > 1) fetchTVShows();
  }, [page, fetchTVShows]);

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <h1 className="text-white text-3xl font-bold mb-6">Popüler Diziler</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {tvShows.map((show) => (
          <div
            key={show.id}
            onClick={() => navigate(`/tv/${show.id}`)}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-transform cursor-pointer relative"
          >
            <img
              src={IMAGE_BASE_URL + show.poster_path}
              alt={show.name}
              className="w-full h-80 object-cover"
            />
            {/* Yıldızlar */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-yellow-400 px-2 py-1 rounded">
              {"★".repeat(Math.round(show.vote_average / 2)) +
                "☆".repeat(5 - Math.round(show.vote_average / 2))}
            </div>

            <div className="p-4">
              <h2 className="text-white text-lg font-semibold mb-2">{show.name}</h2>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-white text-center mt-4">Yükleniyor...</p>}
    </div>
  );
};

export default Tv;
