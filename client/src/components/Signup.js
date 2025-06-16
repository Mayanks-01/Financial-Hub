import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = ({ onLogin }) => {
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    otp: '',
    gender: '',
    age: '',
    address: '',
    state: '',
    pincode: '',
    panCard: '',
    annualSalary: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup/request-otp', {
        email: formData.email,
      });
      if (res.data.message === 'OTP sent to your email') {
        setStep('otp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup/verify-otp', {
        email: formData.email,
        otp: formData.otp,
      });
      if (res.data.message === 'OTP verified') {
        setStep('details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStep('financial');
  };

  const handleFinancialSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup/complete', formData);
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  const handleGoogleSignup = () => {
    setError('');
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          {step === 'form' ? 'Sign Up' : step === 'otp' ? 'Verify OTP' : step === 'details' ? 'Personal Details' : 'Financial Details'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {step === 'form' && (
          <>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
                Send OTP
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">Or sign up with:</p>
              <button
                onClick={handleGoogleSignup}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border rounded-lg hover:bg-gray-100 transition duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.04.69-2.36 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.56 7.68 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.68 1 4.01 3.44 2.18 7.07l2.66 2.84c.87-2.60 3.30-4.53 6.16-4.53z" />
                </svg>
                Sign Up with Google
              </button>
              <p className="mt-4 text-gray-600">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
              </p>
            </div>
          </>
        )}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            />
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
              Verify OTP
            </button>
          </form>
        )}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Age"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <input
              type="text"
              placeholder="Pincode"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            />
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
              Next
            </button>
          </form>
        )}
        {step === 'financial' && (
          <form onSubmit={handleFinancialSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="PAN Card"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.panCard}
              onChange={(e) => setFormData({ ...formData, panCard: e.target.value })}
            />
            <input
              type="number"
              placeholder="Annual Salary"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.annualSalary}
              onChange={(e) => setFormData({ ...formData, annualSalary: e.target.value })}
            />
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;