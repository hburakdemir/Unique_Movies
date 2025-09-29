import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [genres, setGenres] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  // Türleri çek
  useEffect(() => {
    if (!API_KEY) return;

    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=tr-TR`
    )
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
      .catch((err) => console.error(err));
  }, [API_KEY]);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setOpen(false);
  };

  return (
    <nav className="bg-[#393E46] shadow-md relative z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="text-white font-bold text-xl cursor-pointer flex mr-40"
            onClick={() => handleNavigation("/")}
          >
            🎬 Logo Yakında
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNavigation("/")}
              className="px-4 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Ana Sayfa
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="px-4 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1"
              >
                Kategoriler
                <Icon
                  icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
                  className="w-5 h-5"
                />
              </button>

              {open && (
                <div className="absolute left-0 mt-2 bg-gray-800 rounded-lg shadow-xl z-50 p-4 w-[600px] max-h-[400px] overflow-y-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        className="px-3 py-2 text-white text-sm hover:bg-gray-700 rounded-lg transition-colors text-left"
                        onClick={() => {
                          handleNavigation(`/category/${genre.id}`);
                        }}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavigation("/tv")}
              className="px-4 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              TV
            </button>

            <button
              onClick={() => handleNavigation("/sorting")}
              className="px-4 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sıralama
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="İşlevi yok sakin ol"
                className="px-4 py-2 pr-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 w-48"
              />
              <Icon
                icon="mdi:magnify"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>

            <Icon
              icon="mdi:account-circle"
              className="text-white w-10 h-10 cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => handleNavigation("/profile")}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
            >
              <Icon
                icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"}
                className="w-8 h-8"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {/* Arama - Mobile */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="YAKINDA GELİCEK"
                className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <Icon
                icon="mdi:magnify"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>

            <button
              onClick={() => handleNavigation("/")}
              className="block w-full text-left px-4 py-3 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Ana Sayfa
            </button>

            {/* Kategoriler - Mobile Accordion */}
            <div>
              <button
                onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>Kategoriler</span>
                <Icon
                  icon={
                    mobileCategoryOpen ? "mdi:chevron-up" : "mdi:chevron-down"
                  }
                  className="w-5 h-5"
                />
              </button>

              {mobileCategoryOpen && (
  <div className="mt-2 pl-4 space-y-1 max-h-60 overflow-y-auto">
    {genres.map((genre) => (
      <button
        key={genre.id}
        className="block w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-700 rounded-lg transition-colors"
        onClick={() => handleNavigation(`/category/${genre.id}`)}
      >
        {genre.name}
      </button>
    ))}
  </div>
)}

            </div>

            <button
              onClick={() => handleNavigation("/tv")}
              className="block w-full text-left px-4 py-3 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              TV
            </button>

            <button
              onClick={() => handleNavigation("/sorting")}
              className="block w-full text-left px-4 py-3 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sıralama
            </button>

            <button
              onClick={() => handleNavigation("/profile")}
              className="flex items-center w-full text-left px-4 py-3 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Icon icon="mdi:account-circle" className="w-6 h-6 mr-2" />
              Profil
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #4b5563;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
