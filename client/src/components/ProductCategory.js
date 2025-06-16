import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${category}`);
        setProviders(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching providers');
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const handleApply = (providerId) => {
    navigate(`/products/${category}/apply/${providerId}`);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
          {category.replace(/-/g, ' ').toUpperCase()} Providers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800">{provider.name}</h3>
              <p className="text-gray-600 mt-2"><strong>Features:</strong> {provider.features}</p>
              <p className="text-gray-600 mt-2"><strong>Eligibility:</strong> {provider.eligibility}</p>
              <button
                onClick={() => handleApply(provider.id)}
                className="mt-4 w-full px-4 py-2 bg-transparent border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition duration-300"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;