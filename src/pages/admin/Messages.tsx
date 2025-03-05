<lov-code>
import React, { useState, useEffect } from 'react';
import { Search, X, ChevronDown, Star, Filter, RefreshCw } from 'lucide-react';
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
  }, []);

  const fetchStatusCounts = async () => {
    try {
      // Get counts for each status type
      const statusList = ['Baru', 'Dihubungi', 'Selesai'];
      const countsPromises = statusList.map(async (status) => {
        const { count, error } = await supabase
          .from('client_messages')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
          
        if (error) {
          console.error(`Error counting ${status} messages:`, error);
          return { status, count: 0 };
        }
        
        return { status, count: count || 0 };
      });
      
      const results = await Promise.all(countsPromises);
      console.log('Status counts:', results);
      setStatusCounts(results);
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching messages from Supabase...');
      
      // First try direct fetch as a test
      try {
        console.log('Testing raw fetch to Supabase');
        const response = await fetch(`${SUPABASE_API_URL}/rest/v1/client_messages?select=*`, {
          headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`
          }
        });
        
        if (!response.ok) {
          console.error('Raw fetch error, status:', response.status);
          const errorText = await response.text();
          console.error('Raw fetch error details:', errorText);
        } else {
          const rawData = await response.json();
          console.log('Raw fetch successful, got', rawData.length, 'messages');
        }
      } catch (error) {
        console.error('Raw fetch error:', error);
      }
      
      // Now try with supabase client
      const { data, error } = await supabase
        .from('client_messages')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching messages with supabase client:', error);
        console.error('Error details:', error.details, error.message, error.code);
        toast.error(`Failed to load messages: ${error.message}`);
        
        // Fallback to fetch API as a last resort
        try {
          console.log('Trying fallback fetch method...');
          const fallbackResponse = await fetch(`${SUPABASE_API_URL}/rest/v1/client_messages?select=*`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_API_KEY,
              'Authorization': `Bearer ${SUPABASE_API_KEY}`,
              'Prefer': 'return=representation'
            }
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('Fallback fetch successful:', fallbackData);
            
            if (Array.isArray(fallbackData) && fallbackData.length > 0) {
              processAndSetMessages(fallbackData);
              return;
            }
          } else {
            console.error('Fallback fetch failed:', await fallbackResponse.text());
          }
        } catch (fallbackError) {
          console.error('Fallback fetch error:', fallbackError);
        }
        
        setIsLoading(false);
        return;
      }

      console.log('Messages retrieved successfully:', data);
      processAndSetMessages(data || []);
    } catch (error) {
      console.error('Unexpected error fetching messages:', error);
      toast.error('An unexpected error occurred while fetching messages');
      setIsLoading(false);
    }
  };
  
  const processAndSetMessages = (data: any[]) => {
    // Convert and validate the data before setting state
    const validMessages = data.map(msg => {
      // Ensure status is one of the allowed values
      let validStatus: 'Baru' | 'Dihubungi' | 'Selesai';
      
      if (!['Baru', 'Dihubungi', 'Selesai'].includes(msg.status || '')) {
        validStatus = 'Baru'; // Default status if invalid
      } else {
        validStatus = msg.status as 'Baru' | 'Dihubungi' | 'Selesai';
      }
      
      return {
        ...msg,
        status: validStatus,
        // Ensure boolean type for starred
        starred: Boolean(msg.starred)
      } as ClientMessage;
    });

    setMessages(validMessages);
    // After setting messages, fetch status counts
    fetchStatusCounts();
    setIsLoading(false);
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
      console.log(`Updating starred status for message ${id} to: ${newStarredStatus}`);
      
      const { error } = await supabase
        .from('client_messages')
        .update({ starred: newStarredStatus })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating starred status:', error);
        console.error('Error details:', error.details, error.message, error.code);
        toast.error(`Failed to update starred status: ${error.message}`);
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
      
      // Refresh status counts if needed
      if (statusFilter === 'Starred') {
        fetchStatusCounts();
      }
      
      toast.success('Message starred status updated');
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
        console.error('Error details:', error.details, error.message, error.code);
        toast.error(`Failed to update message status: ${error.message}`);
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
        console.log(`Deleting message with ID: ${id}`);
        
        const { error } = await supabase
          .from('client_messages')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Error deleting message:', error);
          console.error('Error details:', error.details, error.message, error.code);
          toast.error(`Failed to delete message: ${error.message}`);
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

  // Helper function for status badge styling
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
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-2">Client Messages</h1>
        <p className="text-gray-500">Manage all client inquiries and messages</p>
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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="relative w-full md:w-auto md:flex-1 max-w-md">
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
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => fetchMessages()}
            className="px-3 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 flex items-center gap-1"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Loading..." : "Refresh"}
          </button>
          
          <button 
            onClick={() => setStatusFilter('All')} 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'All' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter size={14} className="inline mr-1" />
            All
          </button>
          
          <div className="flex gap-1">
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
          </div>
          
          <button 
            onClick={() => setStatusFilter('Starred')} 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'Starred' 
                ? 'bg-amber-200 text-amber-800' 
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }`}
          >
            <Star size={14} className="inline mr-1" />
            Starred
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No messages found matching your criteria.</p>
            <button 
              onClick={fetchMessages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
            <table className="w-full min-w-[1000px] table-auto">
              <thead>
                <tr className="bg-gray-50 text-left border-b border-gray-200">
                  <th className="px-4 py-3 text-gray-600 font-medium text-sm whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-gray-600 font-medium text-sm whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-gray-600 font-medium text-sm whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-gray-600 font-medium text-sm whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 text-gray-600 font-medium text-sm whitespace-nowrap">Subject</th>
                  <th className="px-4 py-3 text-gray-600 font-medium text-sm whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-gray-600 font-medium text-sm whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                      {formatDate(message.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap flex items-center">
                      {message.starred && <Star size={16} className="text-amber-500 mr-1 inline-block" />}
                      <span className="truncate max-w-[150px]">{message.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                      <span className="truncate max-w-[150px] block">{message.email}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                      {message.phone || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <span className="truncate max-w-[150px] block">{message.subject}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
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
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewMessageDetails(message)}
                          className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 whitespace-nowrap"
                        >
                          View
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
                              Status
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
                  <div
