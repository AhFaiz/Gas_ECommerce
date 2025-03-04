
import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Eye, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Update the Order interface to match exactly what's in the database
interface Order {
  id: string;
  created_at: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  product_id: string | null;
  quantity: number;
  total_price: number;
  product?: {
    name: string;
    id: string;
  };
}

// Define a type for the allowed status values for type checking in the UI
type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'New';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Function to check if there's any data in the orders table
  const checkOrdersTableData = async () => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      console.log(`Orders table count check: ${count} records found`);
      
      if (error) {
        console.error('Error checking orders count:', error);
      } else if (count === 0) {
        console.warn('Orders table is empty. No records exist in the database.');
      }
    } catch (err) {
      console.error('Failed to check orders count:', err);
    }
  };

  // Alternative fetch function with a different query approach
  const fetchOrdersAlternative = async () => {
    try {
      console.log('Trying alternative fetch approach...');
      
      // First, fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) {
        console.error('Alternative fetch - Error fetching orders:', ordersError);
        return;
      }

      console.log('Alternative fetch - Orders data:', ordersData);
      
      if (!ordersData || ordersData.length === 0) {
        console.warn('Alternative fetch - No orders found');
        return;
      }

      // Then, for each order, fetch the associated product
      const ordersWithProducts = await Promise.all(
        ordersData.map(async (order) => {
          if (!order.product_id) {
            return { ...order, product: null };
          }

          const { data: productData } = await supabase
            .from('products')
            .select('id, name')
            .eq('id', order.product_id)
            .single();

          return { ...order, product: productData || null };
        })
      );

      console.log('Alternative fetch - Orders with products:', ordersWithProducts);
      
      if (ordersWithProducts.length > 0) {
        setOrders(ordersWithProducts);
        setFetchError(null);
      }
    } catch (err) {
      console.error('Error in alternative fetch approach:', err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setFetchError(null);
    
    try {
      console.log('Fetching orders from Supabase...');
      await checkOrdersTableData();
      
      // Explicitly log what we're about to do
      console.log('About to execute query on orders table with join to products');
      
      // Simplified query - First try with minimal columns
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          created_at, 
          status, 
          customer_name, 
          customer_email, 
          customer_phone, 
          customer_address, 
          product_id, 
          quantity, 
          total_price,
          product:products(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        setFetchError(error.message);
        toast.error(`Failed to load orders: ${error.message}`);
        
        // Try alternative approach as fallback
        await fetchOrdersAlternative();
        setLoading(false);
        return;
      }

      // Log the raw data received to help with debugging
      console.log('Orders raw data:', data);
      
      if (!data || data.length === 0) {
        console.log('No orders found in the database');
        setOrders([]);
        
        // Try alternative approach as fallback
        await fetchOrdersAlternative();
      } else {
        console.log(`Found ${data.length} orders in the database`);
        console.log('Sample order data:', data[0]);
        setOrders(data);
      }
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      setFetchError(error?.message || 'Unknown error');
      toast.error('Failed to load orders');
      setOrders([]);
      
      // Try alternative approach as fallback
      await fetchOrdersAlternative();
    } finally {
      setLoading(false);
    }
  };

  // Manual insertion of test order if requested
  const insertTestOrder = async () => {
    try {
      console.log('Inserting a test order...');
      
      // First get a valid product_id
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .limit(1);
        
      if (!products || products.length === 0) {
        console.error('No products found for test order');
        toast.error('Cannot create test order: No products found');
        return;
      }
      
      const product_id = products[0].id;
      
      const testOrder = {
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '123456789',
        customer_address: 'Test Address 123',
        product_id,
        quantity: 1,
        total_price: 99.99,
        status: 'Pending'
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert(testOrder)
        .select();
        
      if (error) {
        console.error('Error creating test order:', error);
        toast.error('Failed to create test order');
      } else {
        console.log('Test order created:', data);
        toast.success('Test order created successfully');
        fetchOrders();
      }
    } catch (error) {
      console.error('Error in createTestOrder:', error);
      toast.error('Failed to create test order');
    }
  };

  useEffect(() => {
    console.log('Orders component mounted, fetching orders...');
    fetchOrders();
  }, []);

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    
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

  // Update the handleUpdateStatus to use string for status but ensure we only pass valid values
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    // Validate that the new status is one of the allowed values
    const validStatus: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'New'];
    if (!validStatus.includes(newStatus as OrderStatus)) {
      toast.error(`Invalid status: ${newStatus}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Update local state
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      toast.success(`Status pesanan ${orderId} diperbarui ke ${newStatus}`);
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error('Gagal memperbarui status pesanan');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'New': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
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
        <h1 className="text-2xl font-display font-bold text-gray-800">Manajemen Pesanan</h1>
        <p className="text-sm text-gray-500 mt-1">Lihat dan kelola pesanan pelanggan</p>
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
            placeholder="Cari pesanan..."
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

        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <div className="flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            >
              <option value="All">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Dikirim</option>
              <option value="Delivered">Selesai</option>
              <option value="Cancelled">Dibatalkan</option>
              <option value="New">New</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button 
            onClick={fetchOrders}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            <RefreshCw size={18} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
          
          {/* Debug Button - Create Test Order */}
          {process.env.NODE_ENV !== 'production' && (
            <button
              onClick={insertTestOrder}
              className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <span className="text-sm">Buat Pesanan Test</span>
            </button>
          )}
        </div>
      </div>

      {/* Debug information */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 text-sm">
          <p className="font-semibold">Debug Info:</p>
          <p>Total orders loaded: {orders.length}</p>
          <p>Filtered orders: {filteredOrders.length}</p>
          <p>Current filter: {statusFilter}</p>
          <p>Search query: {searchQuery || '(empty)'}</p>
        </div>
      )}

      {/* Error message */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
          <p className="font-semibold">Error saat memuat data pesanan:</p>
          <p>{fetchError}</p>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <RefreshCw size={24} className="animate-spin text-gray-400" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Memuat data pesanan...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    {fetchError ? 'Error loading orders' : 'Tidak ada pesanan yang ditemukan'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer_name || '-'}</div>
                      <div className="text-sm text-gray-500">{order.customer_email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product?.name || 'Produk tidak ditemukan'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rp{order.total_price?.toLocaleString('id-ID') || '-'}
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
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detail Pesanan - {selectedOrder.id}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-700 mb-2">Informasi Pelanggan</h4>
                    <p className="text-sm mb-1"><span className="font-medium">Nama:</span> {selectedOrder.customer_name || '-'}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Email:</span> {selectedOrder.customer_email || '-'}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Telepon:</span> {selectedOrder.customer_phone || '-'}</p>
                    <p className="text-sm"><span className="font-medium">Alamat:</span> {selectedOrder.customer_address || '-'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-700 mb-2">Informasi Pesanan</h4>
                    <p className="text-sm mb-1"><span className="font-medium">ID Pesanan:</span> {selectedOrder.id}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Tanggal:</span> {formatDate(selectedOrder.created_at)}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Produk:</span> {selectedOrder.product?.name || 'Produk tidak ditemukan'}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Jumlah:</span> {selectedOrder.quantity || '-'}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Total:</span> Rp{selectedOrder.total_price?.toLocaleString('id-ID') || '-'}</p>
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
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Perbarui Status Pesanan</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'New'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
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
                  Tutup
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
