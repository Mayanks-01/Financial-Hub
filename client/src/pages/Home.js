import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Your Financial Future Starts Here
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Explore a wide range of financial products tailored to your needs – from credit cards to investment funds.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Easy to Use</h3>
              <p className="text-gray-600 mt-2 text-center">
                Our platform is designed for simplicity, making it easy to find and apply for the right financial products.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Secure</h3>
              <p className="text-gray-600 mt-2 text-center">
                We prioritize your security with top-notch encryption and data protection measures.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Wide Range of Products</h3>
              <p className="text-gray-600 mt-2 text-center">
                From credit cards to investment funds, we offer a diverse selection to meet your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Credit Cards</h3>
              <p className="text-gray-600 mt-2 text-center">
                Find the best credit cards with rewards, low interest rates, and more.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Loans</h3>
              <p className="text-gray-600 mt-2 text-center">
                Get access to personal, business, and other loans with competitive rates.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Investments</h3>
              <p className="text-gray-600 mt-2 text-center">
                Grow your wealth with our range of investment products, including mutual funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                "FinanceHub made it so easy to find the right credit card for my needs. Highly recommended!"
              </p>
              <p className="mt-4 text-gray-800 font-semibold">- Ravi K.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                "I got my personal loan approved in no time. The process was smooth and hassle-free."
              </p>
              <p className="mt-4 text-gray-800 font-semibold">- Priya S.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                "The investment options are great, and the platform is very user-friendly."
              </p>
              <p className="mt-4 text-gray-800 font-semibold">- Amit G.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;