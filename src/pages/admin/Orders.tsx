
import React, { useState } from 'react';
import { Search, X, Filter, Eye, Check } from 'lucide-react';
import { toast } from 'sonner';

// Sample order data (in a real app, this would come from an API)
const initialOrders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+62 811-2345-6789',
      address: 'Jl. Sudirman No. 123, Jakarta',
    },
    products: [
      { id: 1, name: 'Premium Household LPG Cylinder', quantity: 2, price: 45.99 }
    ],
    total: 91.98,
    status: 'Delivered',
    date: '2023-06-15T08:30:00',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+62 822-3456-7890',
      address: 'Jl. Thamrin No. 45, Jakarta',
    },
    products: [
      { id: 2, name: 'Industrial Propane Gas Tank', quantity: 1, price: 129.99 }
    ],
    total: 129.99,
    status: 'Processing',
    date: '2023-06-18T10:15:00',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '+62 833-4567-8901',
      address: 'Jl. Gatot Subroto No. 67, Jakarta',
    },
    products: [
      { id: 3, name: 'Portable Camping Gas Canister', quantity: 3, price: 19.95 },
      { id: 9, name: 'Automatic Gas Leak Detector', quantity: 1, price: 59.95 }
    ],
    total: 119.8,
    status: 'Shipped',
    date: '2023-06-20T15:45:00',
    paymentMethod: 'Digital Wallet',
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+62 844-5678-9012',
      address: 'Jl. HR Rasuna Said No. 22, Jakarta',
    },
    products: [
      { id: 4, name: 'Commercial Grade Natural Gas Regulator', quantity: 1, price: 78.50 }
    ],
    total: 78.5,
    status: 'Pending',
    date: '2023-06-22T09:00:00',
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: 'ORD-005',
    customer: {
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      phone: '+62 855-6789-0123',
      address: 'Jl. MH Thamrin No. 56, Jakarta',
    },
    products: [
      { id: 5, name: 'High-Pressure Gas Cylinder for Industrial Use', quantity: 1, price: 189.95 },
      { id: 11, name: 'Digital Gas Pressure Regulator', quantity: 1, price: 89.99 }
    ],
    total: 279.94,
    status: 'Delivered',
    date: '2023-06-10T14:30:00',
    paymentMethod: 'Credit Card',
  },
];

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  customer: Customer;
  products: Product[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  paymentMethod: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800">Order Management</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage customer orders</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center">
          <Filter size={18} className="text-gray-400 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{order.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewOrderDetails(order)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <Eye className="h-5 w-5 mr-1" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No orders found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={handleCloseModal}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
            >
              <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Details - {selectedOrder.id}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                    <p className="text-sm mb-1"><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                    <p className="text-sm"><span className="font-medium">Address:</span> {selectedOrder.customer.address}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                    <p className="text-sm mb-1"><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Date:</span> {formatDate(selectedOrder.date)}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span> 
                      <span 
                        className={`ml-1 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-700 mb-3">Order Items</h4>
                <div className="bg-white border rounded-md overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            ${(product.price * product.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 text-right">
                          Total:
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                          ${selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Update Order Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status as Order['status'])}
                        disabled={selectedOrder.status === status}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                          ${selectedOrder.status === status 
                            ? `${getStatusBadgeClass(status)} cursor-not-allowed` 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {selectedOrder.status === status && (
                          <Check size={14} className="mr-1" />
                        )}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
