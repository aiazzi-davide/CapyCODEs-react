import logo from "./logo.svg";
import "./css/App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import GoogleLoginPage from "./pages/GoogleLoginPage";
import RegisterPage from "./pages/RegisterPage";
import Verify from "./pages/Verify";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import AdminPage from "./pages/AdminPage";
import GamePage from "./pages/GamePage";
import NotFoundPage from "./pages/errors/NotFoundPage";


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>

          //AUTHENTICATION ROUTES
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/google" element={<GoogleLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:emailAddr" element={<Verify />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/new-password/:emailAddr" element={<NewPasswordPage />} />
          <Route path="/admin" element={<AdminPage />} />

          //GAME ROUTES
          <Route path="/game/:id" element={<GamePage />} />
          //ERROR ROUTES
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}
export default App;
