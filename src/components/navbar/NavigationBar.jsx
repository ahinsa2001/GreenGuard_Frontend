import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSignOutAlt } from 'react-icons/fa';

const NavigationBar = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    // Fetch user details from session
    axios.get('http://localhost:8080/api/session/user', { withCredentials: true })
      .then(response => {
        setUsername(response.data.username);
        setRole(response.data.role);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user session:', error);
        setLoading(false);
      });
  }, []);

  // Logout function
  const handleLogout = () => {
    axios.post('http://localhost:8080/api/logout')
      .then(() => {
        // Redirect to login page after logout
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <div className="bg-white bg-opacity-20 py-3 px-8 shadow-md flex justify-between items-center h-12">
      {/* App Name */}
      <div className="text-xl font-bold text-black">
        GreenGuard
      </div>

      {/* Right Section: Date, Username, Logout */}
      <div className="flex items-center space-x-6">
        {/* Current Date */}
        <div className="text-gray-700">{currentDate}</div>

        {/* Username */}
        <div className="text-gray-700 font-semibold">Welcome, {username} ({role})</div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
