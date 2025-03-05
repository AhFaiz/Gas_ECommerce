
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Clean up interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString();
  
  // Get admin username from localStorage (fallback to "Admin" if not found)
  const adminUsername = localStorage.getItem('adminUsername') || 'Admin';
  
  // Mock data for dashboard
  const stats = [
    {
      title: 'Total Products',
      value: '24',
      icon: Package,
      change: '+2',
      changeType: 'increase',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Orders',
      value: '143',
      icon: ShoppingCart,
      change: '+12%',
      changeType: 'increase',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Customer Messages',
      value: '32',
      icon: Users,
      change: '-5%',
      changeType: 'decrease',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Revenue',
      value: '$12,430',
      icon: TrendingUp,
      change: '+8%',
      changeType: 'increase',
      color: 'bg-yellow-50 text-yellow-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section with Clock */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">SELAMAT DATANG, {adminUsername}</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome to your admin dashboard</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center bg-gray-50 px-4 py-2 rounded-lg">
          <Clock className="h-5 w-5 text-primary mr-2" />
          <span className="text-lg font-medium">{formattedTime}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span 
                    className={stat.changeType === 'increase' ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}
                  >
                    {stat.change} since last month
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
