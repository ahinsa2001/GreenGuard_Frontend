import React, { useState } from 'react';
import axios from 'axios';
import bgImage from '../../images/bgImage.jpg'; // Use your background image

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/login', {
        email,
        password,
      }, { withCredentials: true });

      // Handle success 
      const role = response.data.role; // Assuming role is sent in the response

      // Redirect based on role
      if (role === 'Admin') {
        window.location.href = '/adminDashboard';
      } else {
        window.location.href = '/workerDashboard';
      }
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen opacity-95"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div 
        className="bg-opacity-80 bg-white text-secondary p-10 rounded-xl shadow-lg backdrop-blur-md w-full max-w-lg text-center border border-gray-300"
        style={{
          borderWidth: '0.2px',
          borderColor: 'secondary',
        }}
      >
        <h1 className="text-2xl font-semibold text-darkGary mb-6 text-primary">
          GreenGuard System
        </h1>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-primary rounded-md bg-green-50 text-green-700"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-primary rounded-md bg-green-50 text-green-700"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer p-3 bg-primary text-secondary rounded-md hover:bg-secondary hover:text-primary transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
