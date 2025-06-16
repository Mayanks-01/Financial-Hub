import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import Products from './components/Products';
import ProductCategory from './components/ProductCategory';
import ApplyForm from './components/ApplyForm';
import Dashboard from './components/Dashboard';
import './App.css';
import 'tailwindcss/tailwind.css';
import './index.css';  
import './dist/output.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);

    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const name = query.get('name');

    if (token && name) {
      localStorage.setItem('token', token);
      const userData = { name };
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true);
      setUser(userData);
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [location]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <>
   
      <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        {!isLoggedIn && <Route path="/signup" element={<Signup onLogin={handleLogin} />} />}
        {!isLoggedIn && <Route path="/login" element={<Login onLogin={handleLogin} />} />}
        {!isLoggedIn && <Route path="/reset-password" element={<ResetPassword />} />}
        <Route path="/products" element={<Products isLoggedIn={isLoggedIn} />} />
        {isLoggedIn && <Route path="/products/:category" element={<ProductCategory />} />}
        {isLoggedIn && <Route path="/products/:category/apply/:providerId" element={<ApplyForm />} />}
        {isLoggedIn && <Route path="/dashboard" element={<Dashboard user={user} />} />}
      </Routes>
      <Footer />
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;