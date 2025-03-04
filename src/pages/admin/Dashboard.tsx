
import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';

const AdminDashboard = () => {
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

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', product: 'Household LPG Cylinder', total: '$45.99', status: 'Delivered' },
    { id: 'ORD-002', customer: 'Jane Smith', product: 'Industrial Gas Tank', total: '$129.99', status: 'Processing' },
    { id: 'ORD-003', customer: 'Robert Johnson', product: 'Camping Gas Canister', total: '$19.95', status: 'Shipped' },
    { id: 'ORD-004', customer: 'Emily Davis', product: 'Commercial Gas Regulator', total: '$78.50', status: 'Pending' },
    { id: 'ORD-005', customer: 'Michael Wilson', product: 'High-Pressure Cylinder', total: '$189.95', status: 'Delivered' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to your admin dashboard</p>
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

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="font-semibold text-lg text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'Pending' ? 'bg-gray-100 text-gray-800' : ''}
                      `}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
