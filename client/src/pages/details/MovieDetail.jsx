import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [images, setImages] = useState([]);
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    // Film detay
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=tr-TR`)
    .then((res) => setMovie(res.data));
    // Oyuncular
    axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=tr-TR`)
    .then((res) => setCredits(res.data));
    // Resimler
    axios.get(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`)
      .then((res) => setImages(res.data.backdrops.slice(0, 10))); // ilk 10 backdrop
  }, [id, API_KEY]);

  if (!movie) return <p className="text-white p-6">Yükleniyor...</p>;


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* backdrop slider */}
      <div className="mb-6">
        <Slider {...sliderSettings}>
          {images.map((img, index) => (
            <div key={index}>
              <img
                src={BACKDROP_BASE_URL + img.file_path}
                alt="backdrop"
                className="w-full h-[400px] object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* film detayı */}
      <div className="flex flex-col md:flex-row p-6 gap-8">
        {/* Poster */}
        <img
          src={IMAGE_BASE_URL + movie.poster_path}
          alt={movie.title}
          className="w-72 rounded-lg shadow-lg"
        />

        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-300 mb-4">{movie.overview}</p>

          <p className="text-yellow-400 font-semibold mb-2">
            IMDb: {movie.vote_average.toFixed(1)} ⭐
          </p>
          <p className="text-gray-400 mb-2">
            Çıkış Tarihi: {movie.release_date}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="text-sm bg-gray-700 px-3 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Oyuncular</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {credits?.cast.slice(0, 10).map((actor) => (
            <div key={actor.id} className="text-center">
              <img
                src={
                  actor.profile_path
                    ? IMAGE_BASE_URL + actor.profile_path
                    : "https://via.placeholder.com/150x225?text=No+Image"
                }
                alt={actor.name}
                className="w-32 h-48 object-cover rounded-lg mx-auto mb-2"
              />
              <p className="font-semibold">{actor.name}</p>
              <p className="text-sm text-gray-400">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
