import React, { useEffect, useState } from "react";
import axios from "axios";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const ratingCategories = [
  { label: "9-10 Puan", min: 9, max: 10 },
  { label: "8-9 Puan", min: 8, max: 9 },
  { label: "7-8 Puan", min: 7, max: 8 },
  { label: "6-7 Puan", min: 6, max: 7 },
  { label: "5-6 Puan", min: 5, max: 6 },
];

const Rated = ({ type = "movie" }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Rated useEffect tetiklendi");
    console.log("API_KEY:", API_KEY ? "Mevcut" : "Bulunamadı");
    console.log("Type:", type);

    if (!API_KEY) {
      console.error("API KEY undefined");
      setError("API key bulunamadı. .env dosyasını kontrol edin.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const endpoint = type === "movie" ? "movie" : "tv";
        const url = `https://api.themoviedb.org/3/${endpoint}/top_rated?api_key=${API_KEY}&language=tr-TR&page=1`;
        
        console.log("Fetching URL:", url);
        
        const res = await axios.get(url);
        console.log("API response:", res.data);
        
        setItems(res.data.results || []);
        setError(null);
      } catch (err) {
        console.error("TMDB fetch error:", err);
        console.error("Error details:", err.response?.data);
        setError(`Veri alınamadı: ${err.response?.data?.status_message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const filterByRating = (min, max) => {
    return items.filter((item) => item.vote_average >= min && item.vote_average < max);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-white text-center text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            API Key: {API_KEY ? "✓ Var" : "✗ Yok"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        En İyi {type === "movie" ? "Filmler" : "Diziler"}
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">Hiç veri bulunamadı.</p>
      ) : (
        ratingCategories.map((cat) => {
          const filteredItems = filterByRating(cat.min, cat.max);
          if (filteredItems.length === 0) return null;

          return (
            <div key={cat.label} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-yellow-400 mr-2">⭐</span>
                {cat.label}
                <span className="text-gray-500 text-sm ml-2">
                  ({filteredItems.length})
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transform transition duration-200 cursor-pointer"
                  >
                    <img
                      src={
                        item.poster_path
                          ? IMAGE_BASE_URL + item.poster_path
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={item.title || item.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-sm font-bold line-clamp-2 mb-1">
                        {item.title || item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-yellow-400 font-semibold">
                          ⭐ {item.vote_average.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-400">
                          ({item.vote_count})
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Rated;