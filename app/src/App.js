import logo from "./logo.svg";
import "./css/App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import GoogleLoginPage from "./pages/GoogleLoginPage";
import RegisterPage from "./pages/RegisterPage";
import Verify from "./pages/Verify";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import NotFoundPage from "./pages/errors/NotFoundPage";


function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/google" element={<GoogleLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:emailAddr" element={<Verify />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/new-password/:emailAddr" element={<NewPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}
export default App;
