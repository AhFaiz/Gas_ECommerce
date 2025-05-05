
import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Eye, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, rawFetch } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [fetchAttempts, setFetchAttempts] = useState(0);

  // Function to check if there's any data in the orders table using direct REST API
  const checkDirectRestApi = async () => {
    try {
      console.log('Checking orders table directly through REST API...');
      const rawData = await rawFetch('/rest/v1/orders?select=*&limit=100');
      
      console.log('Direct REST API results:', {
        isArray: Array.isArray(rawData),
        count: Array.isArray(rawData) ? rawData.length : 'Not an array',
        sample: Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : 'No data'
      });
      
      if (Array.isArray(rawData) && rawData.length > 0) {
        // If we got data directly, use it
        console.log('Successfully retrieved orders via direct REST API!');
        const ordersWithProducts = await Promise.all(
          rawData.map(async (order) => {
            if (!order.product_id) {
              return { ...order, product: null };
            }
            
            try {
              const productData = await rawFetch(`/rest/v1/products?id=eq.${order.product_id}&select=id,name`);
              return { 
                ...order, 
                product: Array.isArray(productData) && productData.length > 0 ? productData[0] : null 
              };
            } catch (err) {
              console.error('Error fetching product for order:', err);
              return { ...order, product: null };
            }
          })
        );
        
        setOrders(ordersWithProducts);
        setFetchError(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error in direct REST API check:', err);
      return false;
    }
  };

  // Function to check if there's any data in the orders table
  const checkOrdersTableData = async () => {
    try {
      console.log('Checking orders table data...');
      
      // First try a basic count
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      console.log(`Orders table count check: ${count} records found`);
      
      if (error) {
        console.error('Error checking orders count:', error);
        return false;
      } else if (count === 0) {
        console.warn('Orders table is empty. No records exist in the database.');
        return false;
      }
      
      // If count is positive, attempt to get first few records
      const { data: sampleData, error: sampleError } = await supabase
        .from('orders')
        .select('id, customer_name, status')
        .limit(3);
        
      if (sampleError) {
        console.error('Error fetching sample orders:', sampleError);
        return false;
      }
      
      console.log('Sample orders data:', sampleData);
      return count > 0;
    } catch (err) {
      console.error('Failed to check orders count:', err);
      return false;
    }
  };

  // Alternative fetch function with a simplified approach
  const fetchOrdersSimple = async () => {
    try {
      console.log('Trying simplified fetch approach...');
      
      // First, fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) {
        console.error('Simple fetch - Error fetching orders:', ordersError);
        return false;
      }

      console.log('Simple fetch - Orders data:', ordersData);
      
      if (!ordersData || ordersData.length === 0) {
        console.warn('Simple fetch - No orders found');
        return false;
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

      console.log('Simple fetch - Orders with products:', ordersWithProducts);
      
      if (ordersWithProducts.length > 0) {
        setOrders(ordersWithProducts);
        setFetchError(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error in simple fetch approach:', err);
      return false;
    }
  };

  // Function to fetch orders with enhanced approach prioritizing successful retrieval
  const fetchOrders = async () => {
    setLoading(true);
    setFetchError(null);
    setFetchAttempts(prev => prev + 1);
    
    try {
      console.log(`Fetching orders from Supabase... (Attempt ${fetchAttempts + 1})`);
      
      // Check if there's data in the table first
      const hasData = await checkOrdersTableData();
      console.log(`Order table has data: ${hasData}`);
      
      if (!hasData) {
        console.log('No data found in orders table, will try inserting test data');
        setOrders([]);
        setLoading(false);
        toast.error('Tidak ada pesanan ditemukan dalam database');
        return;
      }
      
      // Try the standard approach first - with simplified query
      console.log('Trying standard fetch approach with simplified query...');
      
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
          total_price
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error in standard fetch approach:', error);
        setFetchError(`Error standar: ${error.message}`);
        
        // Try alternative approaches
        console.log('Trying alternative fetch approaches...');
        
        // Try simple fetch first
        const simpleSuccess = await fetchOrdersSimple();
        
        if (!simpleSuccess) {
          // As a last resort, try direct REST API
          const directSuccess = await checkDirectRestApi();
          
          if (!directSuccess) {
            console.error('All fetch approaches failed');
            setFetchError('Semua metode pengambilan data gagal. Mohon periksa konsol untuk detail.');
            setOrders([]);
          }
        }
        
        setLoading(false);
        return;
      }

      // Log the raw data received 
      console.log('Standard fetch raw data:', data);
      
      if (!data || data.length === 0) {
        console.log('No orders found with standard fetch, trying alternatives');
        
        // Try simple fetch
        const simpleSuccess = await fetchOrdersSimple();
        
        if (!simpleSuccess) {
          // Try direct REST API
          const directSuccess = await checkDirectRestApi();
          
          if (!directSuccess) {
            setOrders([]);
            setFetchError('Tidak ada pesanan yang ditemukan dalam database');
          }
        }
        
        setLoading(false);
        return;
      }
      
      // If we have orders but no product details, fetch them separately
      console.log(`Found ${data.length} orders, fetching product details...`);
      
      const ordersWithProducts = await Promise.all(
        data.map(async (order) => {
          if (!order.product_id) {
            return { ...order, product: null };
          }
          
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('id, name')
            .eq('id', order.product_id)
            .single();
            
          if (productError) {
            console.warn(`Could not fetch product for order ${order.id}:`, productError);
            return { ...order, product: null };
          }
            
          return { ...order, product: productData };
        })
      );
      
      console.log('Processed orders with product details:', ordersWithProducts);
      setOrders(ordersWithProducts);
      setFetchError(null);
      
      if (ordersWithProducts.length > 0) {
        toast.success(`Berhasil memuat ${ordersWithProducts.length} pesanan`);
      } else {
        toast.warning('Tidak ada pesanan yang ditemukan');
      }
      
    } catch (error: any) {
      console.error('Exception fetching orders:', error);
      setFetchError(error?.message || 'Unknown error');
      toast.error('Gagal memuat pesanan');
      setOrders([]);
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800">Manajemen Pesanan</h1>
        <p className="text-sm text-gray-500 mt-1">Lihat dan kelola pesanan pelanggan</p>
      </div>

      {/* Search and Filter Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pesanan..."
                className="pl-10 pr-4 py-2 w-full"
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

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Semua Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Dikirim</SelectItem>
                    <SelectItem value="Delivered">Selesai</SelectItem>
                    <SelectItem value="Cancelled">Dibatalkan</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Refresh Button */}
              <Button 
                onClick={fetchOrders}
                variant="outline"
                size="sm"
                disabled={loading}
                className="ml-2"
              >
                <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error message */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
          <div className="flex items-start">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error saat memuat data pesanan:</p>
              <p>{fetchError}</p>
              <p className="mt-2">
                Periksa konsol browser untuk detail lebih lanjut.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">ID Pesanan</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex justify-center">
                        <RefreshCw size={24} className="animate-spin text-gray-400" />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Memuat data pesanan...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                      {fetchError ? 'Error loading orders' : 'Tidak ada pesanan yang ditemukan'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-primary">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customer_name || '-'}</div>
                        <div className="text-sm text-gray-500">{order.customer_email || '-'}</div>
                      </TableCell>
                      <TableCell>
                        {order.product?.name || 'Produk tidak ditemukan'}
                      </TableCell>
                      <TableCell>
                        {order.quantity || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell className="font-medium">
                        Rp{order.total_price?.toLocaleString('id-ID') || '-'}
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleViewOrderDetails(order)}
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Detail Pesanan - {selectedOrder.id.substring(0, 8)}...
              </h3>
              <Button
                onClick={handleCloseModal}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Informasi Pelanggan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Nama:</dt>
                        <dd>{selectedOrder.customer_name || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Email:</dt>
                        <dd>{selectedOrder.customer_email || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Telepon:</dt>
                        <dd>{selectedOrder.customer_phone || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Alamat:</dt>
                        <dd className="text-right">{selectedOrder.customer_address || '-'}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Informasi Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">ID Pesanan:</dt>
                        <dd>{selectedOrder.id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Tanggal:</dt>
                        <dd>{formatDate(selectedOrder.created_at)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Produk:</dt>
                        <dd>{selectedOrder.product?.name || 'Produk tidak ditemukan'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Jumlah:</dt>
                        <dd>{selectedOrder.quantity || '-'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Total:</dt>
                        <dd>Rp{selectedOrder.total_price?.toLocaleString('id-ID') || '-'}</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="font-medium text-gray-500">Status:</dt>
                        <dd>
                          <span 
                            className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}
                          >
                            {selectedOrder.status}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Perbarui Status Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'New'].map((status) => (
                      <Button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        disabled={selectedOrder.status === status}
                        variant={selectedOrder.status === status ? "secondary" : "outline"}
                        size="sm"
                        className={selectedOrder.status === status ? 'cursor-not-allowed' : ''}
                      >
                        {selectedOrder.status === status && (
                          <Check size={14} className="mr-1" />
                        )}
                        {status}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end border-t">
              <Button
                onClick={handleCloseModal}
                variant="outline"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
