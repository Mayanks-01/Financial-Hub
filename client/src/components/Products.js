import React from 'react';
import { Link } from 'react-router-dom';

const Products = ({ isLoggedIn }) => {
  const products = [
    { name: 'Credit Card', path: 'credit-card', desc: 'Earn rewards and manage expenses with ease.', icon: '💳' },
    { name: 'Personal Loan', path: 'personal-loan', desc: 'Quick funds for your personal needs.', icon: '💸' },
    { name: 'Business Loan', path: 'business-loan', desc: 'Grow your business with flexible financing.', icon: '🏢' },
    { name: 'Savings Account', path: 'savings-account', desc: 'Secure your money with high interest.', icon: '🏦' },
    { name: 'Demat Account', path: 'demat-account', desc: 'Trade stocks effortlessly.', icon: '📈' },
    { name: 'Investment in Funds', path: 'investment-funds', desc: 'Build wealth with mutual funds.', icon: '💰' },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen py-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          Explore Financial Products
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          Discover tailored solutions for all your financial needs.
        </p>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.path}
              to={isLoggedIn ? `/products/${product.path}` : '/login'}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{product.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mt-2">{product.desc}</p>
              <div className="mt-4 text-blue-600 font-medium hover:underline">
                Learn More & Apply
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;