
import React, { useState, useEffect } from 'react';
import { Search, X, Eye, Trash2, ChevronDown, Star, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, SUPABASE_API_URL, SUPABASE_API_KEY } from '../../integrations/supabase/client';

interface ClientMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'Baru' | 'Dihubungi' | 'Selesai';
  starred: boolean;
  date: string;
}

interface StatusCount {
  status: string;
  count: number;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedMessage, setSelectedMessage] = useState<ClientMessage | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);

  useEffect(() => {
    fetchMessages();
    fetchStatusCounts();
  }, []);

  const fetchStatusCounts = async () => {
    try {
      // Simpler approach without using the function due to constraint issues
      const statusList = ['Baru', 'Dihubungi', 'Selesai'];
      const countsPromises = statusList.map(async (status) => {
        const { data, error, count } = await supabase
          .from('client_messages')
          .select('id', { count: 'exact', head: true })
          .eq('status', status);
          
        if (error) {
          console.error(`Error counting ${status} messages:`, error);
          return { status, count: 0 };
        }
        
        return { status, count: count || 0 };
      });
      
      const results = await Promise.all(countsPromises);
      setStatusCounts(results);
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching messages from Supabase...');
      
      // Try with the Supabase client
      const { data, error } = await supabase
        .from('client_messages')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching messages with Supabase client:', error);
        
        // Try with a direct API call as a fallback
        try {
          console.log('Attempting direct API call to fetch messages...');
          const response = await fetch(`${SUPABASE_API_URL}/rest/v1/client_messages?select=*&order=date.desc`, {
            headers: {
              'apikey': SUPABASE_API_KEY,
              'Authorization': `Bearer ${SUPABASE_API_KEY}`
            }
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Direct API call failed:', response.status, errorText);
            toast.error('Failed to load messages');
            setIsLoading(false);
            return;
          }
          
          const directData = await response.json();
          console.log('Direct API call succeeded, messages:', directData);
          
          // Process the data the same way as the Supabase client version
          const validMessages = (directData || []).map((msg: any) => {
            const validStatus = ['Baru', 'Dihubungi', 'Selesai'].includes(msg.status || '') 
              ? (msg.status as 'Baru' | 'Dihubungi' | 'Selesai') 
              : 'Baru';
            
            return {
              ...msg,
              status: validStatus,
              starred: Boolean(msg.starred)
            } as ClientMessage;
          });
          
          setMessages(validMessages);
          setIsLoading(false);
          return;
        } catch (directError) {
          console.error('Direct API call exception:', directError);
          toast.error('Failed to load messages');
          setIsLoading(false);
          return;
        }
      }

      console.log('Messages retrieved successfully:', data);
      
      // Convert and validate the status field before setting state
      const validMessages = (data || []).map(msg => {
        // Convert old statuses to new ones
        let newStatus: 'Baru' | 'Dihubungi' | 'Selesai';
        
        if (msg.status === 'Unread') {
          newStatus = 'Baru';
        } else if (msg.status === 'Read') {
          newStatus = 'Baru'; // Keep as Baru for now
        } else if (msg.status === 'Replied') {
          newStatus = 'Dihubungi';
        } else if (['Baru', 'Dihubungi', 'Selesai'].includes(msg.status || '')) {
          newStatus = msg.status as 'Baru' | 'Dihubungi' | 'Selesai';
        } else {
          newStatus = 'Baru'; // Default
        }
        
        return {
          ...msg,
          status: newStatus,
          // Ensure boolean type for starred
          starred: Boolean(msg.starred)
        } as ClientMessage;
      });

      setMessages(validMessages);
      // After setting messages, refresh status counts
      fetchStatusCounts();
    } catch (error) {
      console.error('Unexpected error fetching messages:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter messages based on search query and status filter
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || message.status === statusFilter;
    const matchesStarred = statusFilter === 'Starred' ? message.starred : true;
    
    return matchesSearch && matchesStatus && matchesStarred;
  });

  const handleViewMessageDetails = async (message: ClientMessage) => {
    // Mark as read when opening if it's "Baru"
    if (message.status === 'Baru') {
      try {
        const { error } = await supabase
          .from('client_messages')
          .update({ status: 'Baru' }) // Keep status as Baru but mark as read
          .eq('id', message.id);
          
        if (error) {
          console.error('Error updating message status:', error);
        }
      } catch (error) {
        console.error('Unexpected error updating message status:', error);
      }
    }
    
    setSelectedMessage(message);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleToggleStarred = async (id: string) => {
    const messageToUpdate = messages.find(m => m.id === id);
    if (!messageToUpdate) return;
    
    const newStarredStatus = !messageToUpdate.starred;
    
    try {
      const { error } = await supabase
        .from('client_messages')
        .update({ starred: newStarredStatus })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating starred status:', error);
        toast.error('Failed to update starred status');
        return;
      }
      
      // Update local state
      const updatedMessages = messages.map(message => 
        message.id === id ? { ...message, starred: newStarredStatus } : message
      );
      setMessages(updatedMessages);
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, starred: newStarredStatus });
      }
    } catch (error) {
      console.error('Unexpected error updating starred status:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Baru' | 'Dihubungi' | 'Selesai') => {
    try {
      console.log(`Updating message status to: ${newStatus}`);
      
      // Make sure newStatus is one of the allowed values
      if (!['Baru', 'Dihubungi', 'Selesai'].includes(newStatus)) {
        console.error('Invalid status value:', newStatus);
        toast.error('Invalid status value');
        return;
      }
      
      const { error } = await supabase
        .from('client_messages')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating message status:', error);
        toast.error('Failed to update message status');
        return;
      }
      
      // Update local state
      const updatedMessages = messages.map(message => 
        message.id === id ? { ...message, status: newStatus } : message
      );
      setMessages(updatedMessages);
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      
      toast.success(`Status updated to ${newStatus}`);
      
      // Refresh status counts after updating
      fetchStatusCounts();
    } catch (error) {
      console.error('Unexpected error updating message status:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const { error } = await supabase
          .from('client_messages')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Error deleting message:', error);
          toast.error('Failed to delete message');
          return;
        }
        
        setMessages(messages.filter(message => message.id !== id));
        toast.success('Message deleted successfully');
        
        if (selectedMessage && selectedMessage.id === id) {
          handleCloseModal();
        }
        
        // Refresh status counts after deleting
        fetchStatusCounts();
      } catch (error) {
        console.error('Unexpected error deleting message:', error);
        toast.error('An unexpected error occurred');
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Baru': return 'bg-blue-100 text-blue-800';
      case 'Dihubungi': return 'bg-yellow-100 text-yellow-800';
      case 'Selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-4">Client Messages</h1>
      </div>

      {/* Status Dashboard */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statusCounts.map((item) => (
          <div 
            key={item.status}
            className={`p-4 rounded-lg shadow-sm flex flex-col items-center cursor-pointer transition-all hover:shadow-md ${
              statusFilter === item.status ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setStatusFilter(item.status)}
          >
            <div className={`text-sm font-medium rounded-full px-3 py-1 mb-2 ${getStatusBadgeClass(item.status)}`}>
              {item.status}
            </div>
            <div className="text-2xl font-bold">{item.count}</div>
            <div className="text-xs text-gray-500 mt-1">messages</div>
          </div>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
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
        
        <div className="flex gap-2">
          <button 
            onClick={() => setStatusFilter('All')} 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'All' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter size={16} className="inline mr-1" />
            All
          </button>
          <button 
            onClick={() => setStatusFilter('Baru')} 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'Baru' 
                ? 'bg-blue-200 text-blue-800' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            Baru
          </button>
          <button 
            onClick={() => setStatusFilter('Dihubungi')} 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'Dihubungi' 
                ? 'bg-yellow-200 text-yellow-800' 
                : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
            }`}
          >
            Dihubungi
          </button>
          <button 
            onClick={() => setStatusFilter('Selesai')} 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'Selesai' 
                ? 'bg-green-200 text-green-800' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            Selesai
          </button>
          <button 
            onClick={() => setStatusFilter('Starred')} 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'Starred' 
                ? 'bg-amber-200 text-amber-800' 
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }`}
          >
            <Star size={16} className="inline mr-1" />
            Starred
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No messages found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-gray-600 font-medium text-sm">Tanggal</th>
                  <th className="px-6 py-3 text-gray-600 font-medium text-sm">Nama</th>
                  <th className="px-6 py-3 text-gray-600 font-medium text-sm">Email</th>
                  <th className="px-6 py-3 text-gray-600 font-medium text-sm">Telepon</th>
                  <th className="px-6 py-3 text-gray-600 font-medium text-sm">Status</th>
                  <th className="px-6 py-3 text-gray-600 font-medium text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {formatDate(message.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 flex items-center">
                      {message.starred && <Star size={16} className="text-amber-500 mr-1 inline-block" />}
                      {message.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {message.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {message.phone || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          message.status === 'Dihubungi' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : message.status === 'Baru'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {message.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewMessageDetails(message)}
                          className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                        >
                          Lihat
                        </button>
                        
                        <div className="relative inline-block text-left">
                          <div>
                            <button
                              type="button"
                              className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center"
                              id={`status-menu-button-${message.id}`}
                              aria-expanded="true"
                              aria-haspopup="true"
                              onClick={() => {
                                const dropdown = document.getElementById(`status-dropdown-${message.id}`);
                                if (dropdown) {
                                  dropdown.classList.toggle('hidden');
                                }
                              }}
                            >
                              {message.status}
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                          <div 
                            id={`status-dropdown-${message.id}`}
                            className="hidden origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby={`status-menu-button-${message.id}`}
                            tabIndex={-1}
                          >
                            <div className="py-1" role="none">
                              <button
                                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                role="menuitem"
                                tabIndex={-1}
                                onClick={() => {
                                  handleUpdateStatus(message.id, 'Baru');
                                  const dropdown = document.getElementById(`status-dropdown-${message.id}`);
                                  if (dropdown) dropdown.classList.add('hidden');
                                }}
                              >
                                Baru
                              </button>
                              <button
                                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                role="menuitem"
                                tabIndex={-1}
                                onClick={() => {
                                  handleUpdateStatus(message.id, 'Dihubungi');
                                  const dropdown = document.getElementById(`status-dropdown-${message.id}`);
                                  if (dropdown) dropdown.classList.add('hidden');
                                }}
                              >
                                Dihubungi
                              </button>
                              <button
                                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                role="menuitem"
                                tabIndex={-1}
                                onClick={() => {
                                  handleUpdateStatus(message.id, 'Selesai');
                                  const dropdown = document.getElementById(`status-dropdown-${message.id}`);
                                  if (dropdown) dropdown.classList.add('hidden');
                                }}
                              >
                                Selesai
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleToggleStarred(message.id)}
                          className={`p-1 rounded-md ${
                            message.starred 
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                            : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-amber-500'
                          }`}
                        >
                          <Star size={18} className={message.starred ? 'fill-amber-500' : ''} />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="p-1 text-red-500 bg-red-50 rounded-md hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {isDetailsModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
              onClick={handleCloseModal}
            ></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">
                  Detail Pesan Klien
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStarred(selectedMessage.id)}
                    className={`p-1 rounded-full ${
                      selectedMessage.starred 
                      ? 'text-amber-500' 
                      : 'text-gray-400 hover:text-amber-500'
                    }`}
                  >
                    <Star size={20} className={selectedMessage.starred ? 'fill-amber-500' : ''} />
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex">
                  <div className="w-1/4 text-gray-500">Nama:</div>
                  <div className="w-3/4 font-medium">{selectedMessage.name}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/4 text-gray-500">Email:</div>
                  <div className="w-3/4 font-medium flex items-center">
                    <span className="text-blue-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedMessage.email}
                    </span>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/4 text-gray-500">Telepon:</div>
                  <div className="w-3/4 font-medium flex items-center">
                    {selectedMessage.phone ? (
                      <span className="text-blue-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {selectedMessage.phone}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-1/4 text-gray-500">Tanggal:</div>
                  <div className="w-3/4 font-medium">{formatFullDate(selectedMessage.date)}</div>
                </div>
                
                <div className="flex">
                  <div className="w-1/4 text-gray-500">Status:</div>
                  <div className="w-3/4">
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedMessage.status === 'Dihubungi' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : selectedMessage.status === 'Baru'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {selectedMessage.status}
                      </span>
                      
                      <div className="relative">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            const dropdown = document.getElementById('modal-status-dropdown');
                            if (dropdown) {
                              dropdown.classList.toggle('hidden');
                            }
                          }}
                        >
                          <ChevronDown size={16} />
                        </button>
                        <div 
                          id="modal-status-dropdown"
                          className="hidden absolute left-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                        >
                          <div className="py-1">
                            <button
                              className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => {
                                handleUpdateStatus(selectedMessage.id, 'Baru');
                                const dropdown = document.getElementById('modal-status-dropdown');
                                if (dropdown) dropdown.classList.add('hidden');
                              }}
                            >
                              Baru
                            </button>
                            <button
                              className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => {
                                handleUpdateStatus(selectedMessage.id, 'Dihubungi');
                                const dropdown = document.getElementById('modal-status-dropdown');
                                if (dropdown) dropdown.classList.add('hidden');
                              }}
                            >
                              Dihubungi
                            </button>
                            <button
                              className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => {
                                handleUpdateStatus(selectedMessage.id, 'Selesai');
                                const dropdown = document.getElementById('modal-status-dropdown');
                                if (dropdown) dropdown.classList.add('hidden');
                              }}
                            >
                              Selesai
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-500">Pesan:</div>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-800">
                    {selectedMessage.subject && <div className="font-medium mb-2">{selectedMessage.subject}</div>}
                    <div className="whitespace-pre-line">{selectedMessage.message}</div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-black text-white rounded font-medium hover:bg-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
