import "./css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/errors/NotFoundPage";

function App() {
  return (
    <>
      <Router>
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
          <Route path="/cart" element={<CartPage />} />
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
