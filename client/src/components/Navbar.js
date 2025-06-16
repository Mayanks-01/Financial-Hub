import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">FinanceHub</Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              
              <Link to="/products" className="text-white hover:text-gray-200">
                Products
              </Link>
              <Link to="/dashboard" className="text-white hover:text-gray-200">
               Welcome, {user?.name}
              </Link>
            
             <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
            Logout
            </button>
                
              
             
            </>
          ) : (
            <>
              <Link to="/products" className="text-white hover:text-gray-200">
                Products
              </Link>
              <Link to="/login" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link to="/signup" className="text-white hover:text-gray-200">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;