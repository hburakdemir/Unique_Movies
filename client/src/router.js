import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./App";
import Navbar from "./components/Navbar";
import Rated from "./pages/Rated";
import Tv from "./pages/Tv";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MovieDetail from "./pages/details/MovieDetail";
import TvDetail from "./pages/details/TvDetailPage";
import CategoryPage from "./pages/CategoryPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sorting" element={<Rated />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<TvDetail />} />
        <Route path="/category/:id" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
