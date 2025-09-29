import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const TvDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [genres, setGenres] = useState([]);
  const [cast, setCast] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

//detaylar
  useEffect(() => {
    if (!id || !API_KEY) {
      setError("ID veya API Key bulunamadı");
      setLoading(false);
      return;
    }

    setLoading(true);
    
    axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=tr-TR`).then((res) => {
        console.log("TV Detail:", res.data);
        setItem(res.data);
        setGenres(res.data.genres || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Detail Error:", err);
        setError("Dizi detayları yüklenemedi");
        setLoading(false);
      });
  }, [id, API_KEY]);

  useEffect(() => {
    if (!id || !API_KEY) return;

    axios
      .get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=tr-TR`)
      .then((res) => {
        console.log("Cast:", res.data.cast);
        setCast(res.data.cast.slice(0, 8));
      })
      .catch((err) => console.error("Cast Error:", err));
  }, [id, API_KEY]);

  useEffect(() => {
    if (!id || !API_KEY) return;

    axios
      .get(`https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}`)
      .then((res) => {
        console.log("Backdrops:", res.data.backdrops);
        setBackdrops(res.data.backdrops.slice(0, 10));
      })
      .catch((err) => console.error("Backdrops Error:", err));
  }, [id, API_KEY]);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Dizi bulunamadı</p>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={
                item.poster_path
                  ? IMAGE_BASE_URL + item.poster_path
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={item.name}
              className="w-64 md:w-72 rounded-lg shadow-lg"
            />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">{item.name}</h1>
      
            <div className="flex items-center gap-4 text-gray-300">
              <p className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="font-semibold">{item.vote_average?.toFixed(1)}</span>
                <span className="text-sm">/ 10</span>
              </p>
              <span>•</span>
              <p>{item.first_air_date}</p>
              {item.number_of_seasons && (
                <>
                  <span>•</span>
                  <p>{item.number_of_seasons} Sezon</p>
                </>
              )}
              {item.number_of_episodes && (
                <>
                  <span>•</span>
                  <p>{item.number_of_episodes} Bölüm</p>
                </>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="bg-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-600 transition"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {item.overview && (
              <div>
                <h2 className="text-xl font-bold mb-2">Özet</h2>
                <p className="text-gray-300 leading-relaxed">{item.overview}</p>
              </div>
            )}

            {cast.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">Başlıca Oyuncular</h2>
                <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
                  {cast.map((c) => (
                    <div key={c.id} className="flex flex-col items-center w-24 flex-shrink-0">
                      <img
                        src={
                          c.profile_path
                            ? IMAGE_BASE_URL + c.profile_path
                            : "https://via.placeholder.com/100x150?text=No+Photo"
                        }
                        alt={c.name}
                        className="w-24 h-32 object-cover rounded-lg mb-2 shadow-md"
                      />
                      <span className="text-xs text-center font-medium">{c.name}</span>
                      <span className="text-xs text-gray-400 text-center">{c.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {backdrops.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Görseller</h2>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Slider {...sliderSettings}>
                {backdrops.map((b, index) => (
                  <div key={index} className="relative">
                    <img
                      src={BACKDROP_BASE_URL + b.file_path}
                      alt={`Backdrop ${index + 1}`}
                      className="w-full h-96 object-cover"
                      onError={(e) => {
                        console.log("Resim yüklenemedi:", b.file_path);
                        e.target.src = "https://via.placeholder.com/1920x1080?text=Resim+Yuklenemedi";
                      }}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default TvDetailPage;