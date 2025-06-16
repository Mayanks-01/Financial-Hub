import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(user || {});
  const [applications, setApplications] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [view, setView] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          navigate('/login');
          return;
        }
        const [profileRes, applicationsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/products/applications', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProfile(profileRes.data);
        setApplications(applicationsRes.data || []);
      } catch (err) {
        setError(`Failed to fetch data: ${err.response?.data?.error || err.message}`);
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-md p-6 flex flex-col h-screen">
        <div className="flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${profile.name || 'User'}&background=0D8ABC&color=fff`}
            alt="Avatar"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800">{profile.name || 'User'}</h3>
          <p className="text-gray-600 text-sm">{profile.email || 'No email'}</p>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setView('profile')}
            className={`w-full text-left px-4 py-2 text-gray-700 rounded-lg ${
              view === 'profile' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setView('applications')}
            className={`w-full text-left px-4 py-2 text-gray-700 rounded-lg mt-2 ${
              view === 'applications' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            Applied Products
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mt-2"
          >
            Explore Products
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {view === 'profile' ? (
          editMode ? (
            <form onSubmit={handleUpdate} className="space-y-4 max-w-lg">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
                Update Profile
              </button>
            </form>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
              <h3 className="text-2xl font-semibold mb-4">Profile Details</h3>
              <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
              <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Edit Profile
              </button>
            </div>
          )
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Applied Products</h3>
            {applications.length === 0 ? (
              <p className="text-gray-600">No applications found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100"
                  >
                    <p className="text-lg font-medium">
                      {app.provider_name} ({app.category.replace(/-/g, ' ')})
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Applied On:</strong> {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">
                      <strong>Status:</strong>
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-sm ${
                          app.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;