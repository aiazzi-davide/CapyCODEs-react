import logo from "./logo.svg";
import "./css/App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Verify from "./pages/Verify";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:emailAddr" element={<Verify />} />
          
        </Routes>
        <Footer />
      </Router>
    </>
  );
}
//<Route path="/reset-password" element={<ResetPasswordPage />} />
export default App;
