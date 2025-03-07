
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    // Get admin username from localStorage if available
    const storedUsername = localStorage.getItem('adminUsername');
    if (storedUsername) {
      setAdminName(storedUsername);
    }

    // Setup real-time clock
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(clockInterval);
  }, []);

  // Format the current time
  const formattedTime = format(currentTime, 'HH:mm:ss');
  const formattedDate = format(currentTime, 'EEEE, dd MMMM yyyy');

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Welcome back, {adminName}!</h1>
        <p className="text-gray-600 mb-8">
          This is your admin dashboard. Here you can manage your products, orders, and more.
        </p>
        
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg mx-auto max-w-md">
          <div className="text-4xl font-bold text-primary mb-2">{formattedTime}</div>
          <div className="text-gray-500">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
