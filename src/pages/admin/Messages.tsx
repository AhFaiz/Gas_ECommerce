
import React, { useState } from 'react';
import { Search, X, Eye, Inbox, CheckCircle, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Sample message data (in a real app, this would come from an API)
const initialMessages = [
  {
    id: 1,
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@example.com',
    phone: '+62 812-3456-7890',
    subject: 'Product Information',
    message: 'I would like to know more about the industrial gas cylinders you offer. Do you have any brochures or specifications you could send me?',
    status: 'Unread',
    starred: false,
    date: '2023-06-24T09:15:00',
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    email: 'siti.rahayu@example.com',
    phone: '+62 823-4567-8901',
    subject: 'Delivery Question',
    message: 'I ordered a gas cylinder last week and wanted to check on the estimated delivery time. My order number is ORD-089.',
    status: 'Read',
    starred: true,
    date: '2023-06-23T14:30:00',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    phone: '+62 834-5678-9012',
    subject: 'Bulk Order Inquiry',
    message: 'Our restaurant chain is looking to place a bulk order for LPG cylinders. Could someone from your sales team contact me to discuss pricing and terms?',
    status: 'Replied',
    starred: false,
    date: '2023-06-22T10:45:00',
  },
  {
    id: 4,
    name: 'Dewi Putri',
    email: 'dewi.putri@example.com',
    phone: '+62 845-6789-0123',
    subject: 'Technical Support',
    message: 'I'm having issues with the regulator I purchased from your store. The pressure seems inconsistent and I'm concerned about safety. Can you advise?',
    status: 'Unread',
    starred: false,
    date: '2023-06-24T16:20:00',
  },
  {
    id: 5,
    name: 'Eko Prasetyo',
    email: 'eko.prasetyo@example.com',
    phone: '+62 856-7890-1234',
    subject: 'Partnership Opportunity',
    message: 'I represent a chain of hardware stores across Java and would like to discuss a potential partnership to sell your products in our stores.',
    status: 'Read',
    starred: true,
    date: '2023-06-21T11:05:00',
  },
];

interface ClientMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  starred: boolean;
  date: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ClientMessage[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedMessage, setSelectedMessage] = useState<ClientMessage | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

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

  const handleViewMessageDetails = (message: ClientMessage) => {
    // Mark as read when opening
    if (message.status === 'Unread') {
      const updatedMessages = messages.map(m => 
        m.id === message.id ? { ...m, status: 'Read' as const } : m
      );
      setMessages(updatedMessages);
      message = { ...message, status: 'Read' };
    }
    
    setSelectedMessage(message);
    setIsDetailsModalOpen(true);
    setReplyText('');
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleToggleStarred = (id: number) => {
    const updatedMessages = messages.map(message => 
      message.id === id ? { ...message, starred: !message.starred } : message
    );
    setMessages(updatedMessages);
    
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, starred: !selectedMessage.starred });
    }
  };

  const handleDeleteMessage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(message => message.id !== id));
      toast.success('Message deleted successfully');
      
      if (selectedMessage && selectedMessage.id === id) {
        handleCloseModal();
      }
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMessage) return;
    
    if (replyText.trim() === '') {
      toast.error('Please enter a reply message');
      return;
    }
    
    // Update message status to replied
    const updatedMessages = messages.map(message => 
      message.id === selectedMessage.id ? { ...message, status: 'Replied' as const } : message
    );
    
    setMessages(updatedMessages);
    setSelectedMessage({ ...selectedMessage, status: 'Replied' });
    
    // In a real app, this would send the reply to the customer
    console.log(`Reply to ${selectedMessage.email}:`, replyText);
    
    toast.success('Reply sent successfully');
    setReplyText('');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Unread': return 'bg-blue-100 text-blue-800';
      case 'Read': return 'bg-gray-100 text-gray-800';
      case 'Replied': return 'bg-green-100 text-green-800';
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

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return formatDate(dateString);
  };

  const totalUnread = messages.filter(message => message.status === 'Unread').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800">Client Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and respond to customer inquiries
          {totalUnread > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {totalUnread} unread
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <button
              onClick={() => setStatusFilter('All')}
              className={`flex items-center w-full px-3 py-2 rounded-md text-sm mb-1 ${
                statusFilter === 'All' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'
              }`}
            >
              <Inbox className="h-5 w-5 mr-3" />
              All Messages
              <span className="ml-auto bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                {messages.length}
              </span>
            </button>
            
            <button
              onClick={() => setStatusFilter('Unread')}
              className={`flex items-center w-full px-3 py-2 rounded-md text-sm mb-1 ${
                statusFilter === 'Unread' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'
              }`}
            >
              <div className="h-5 w-5 mr-3 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              Unread
              <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {messages.filter(m => m.status === 'Unread').length}
              </span>
            </button>
            
            <button
              onClick={() => setStatusFilter('Replied')}
              className={`flex items-center w-full px-3 py-2 rounded-md text-sm mb-1 ${
                statusFilter === 'Replied' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="h-5 w-5 mr-3" />
              Replied
              <span className="ml-auto bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                {messages.filter(m => m.status === 'Replied').length}
              </span>
            </button>
            
            <button
              onClick={() => setStatusFilter('Starred')}
              className={`flex items-center w-full px-3 py-2 rounded-md text-sm ${
                statusFilter === 'Starred' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'
              }`}
            >
              <Star className="h-5 w-5 mr-3" />
              Starred
              <span className="ml-auto bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                {messages.filter(m => m.starred).length}
              </span>
            </button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="md:col-span-9">
          {/* Search */}
          <div className="relative mb-4">
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
          
          {/* Messages List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No messages found matching your criteria.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <li 
                    key={message.id} 
                    className={`hover:bg-gray-50 transition-colors cursor-pointer relative ${
                      message.status === 'Unread' ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div 
                      className="px-6 py-4"
                      onClick={() => handleViewMessageDetails(message)}
                    >
                      <div className="flex justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 flex items-center">
                          {message.status === 'Unread' && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                          )}
                          {message.name}
                        </h3>
                        <span className="text-xs text-gray-500">{getRelativeTime(message.date)}</span>
                      </div>
                      
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {message.subject}
                        <span 
                          className={`ml-2 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(message.status)}`}
                        >
                          {message.status}
                        </span>
                      </p>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    
                    <div className="absolute top-4 right-4 flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStarred(message.id);
                        }}
                        className={`p-1 rounded-full ${message.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      >
                        <Star size={16} className={message.starred ? 'fill-yellow-500' : ''} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                        className="p-1 rounded-full text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Message Details Modal */}
      {isDetailsModalOpen && selectedMessage && (
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
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
            >
              <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedMessage.subject}
                  </h3>
                  <span 
                    className={`ml-2 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedMessage.status)}`}
                  >
                    {selectedMessage.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleToggleStarred(selectedMessage.id)}
                    className={`mr-3 ${selectedMessage.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                  >
                    <Star size={18} className={selectedMessage.starred ? 'fill-yellow-500' : ''} />
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedMessage.name}</h4>
                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                    {selectedMessage.phone && (
                      <p className="text-sm text-gray-500">{selectedMessage.phone}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(selectedMessage.date)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <p className="text-gray-800 whitespace-pre-line">{selectedMessage.message}</p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reply</h4>
                  <form onSubmit={handleReplySubmit}>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary/30 focus:ring-2 focus:border-primary mb-3"
                      placeholder="Type your reply here..."
                    ></textarea>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-primary py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Send Reply
                      </button>
                    </div>
                  </form>
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
