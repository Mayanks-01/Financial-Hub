import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = ({ user }) => {
  const [view, setView] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [statusForm, setStatusForm] = useState({ status: 'Pending' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const [appsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/applications', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setApplications(appsRes.data);
        setUsers(usersRes.data.filter((u) => u.role === 'user')); // Only show users
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpdateUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('User updated successfully');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.filter((u) => u.role === 'user'));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating user');
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/applications/${id}`, statusForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Status updated successfully');
      const res = await axios.get('http://localhost:5000/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-md p-6 flex flex-col h-screen">
        <div className="flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name || 'Employee'}&background=0D8ABC&color=fff`}
            alt="Avatar"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800">{user?.name || 'Employee'}</h3>
          <p className="text-gray-600 text-sm">{user?.email || 'No email'}</p>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setView('applications')}
            className={`w-full text-left px-4 py-2 text-gray-700 rounded-lg ${
              view === 'applications' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setView('users')}
            className={`w-full text-left px-4 py-2 text-gray-700 rounded-lg mt-2 ${
              view === 'users' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            Users
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Support Employee Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {view === 'applications' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.map((app) => (
                <div key={app.id} className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100">
                  <p className="text-lg font-medium">
                    {app.provider_name} ({app.category.replace(/-/g, ' ')})
                  </p>
                  <p><strong>User:</strong> {app.name}</p>
                  <p><strong>Email:</strong> {app.email}</p>
                  <p><strong>Phone:</strong> {app.phone}</p>
                  <p><strong>Income:</strong> {app.income}</p>
                  <p><strong>Applied On:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
                  <p>
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
                  <div className="mt-2">
                    <select
                      value={statusForm.status}
                      onChange={(e) => setStatusForm({ status: e.target.value })}
                      className="px-3 py-1 border rounded-lg mr-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleUpdateStatus(app.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'users' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Users</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.map((u) => (
                <div key={u.id} className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100">
                  <p><strong>Name:</strong> {u.name}</p>
                  <p><strong>Email:</strong> {u.email}</p>
                  <p><strong>Phone:</strong> {u.phone || 'N/A'}</p>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-1 border rounded-lg mb-2"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-1 border rounded-lg mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-1 border rounded-lg mb-2"
                    />
                    <button
                      onClick={() => {
                        setFormData({ name: u.name, email: u.email, phone: u.phone || '' });
                        handleUpdateUser(u.id);
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;