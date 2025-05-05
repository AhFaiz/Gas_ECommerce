
import React, { useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { toast } from 'sonner';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUsername');
    toast.success('You have been logged out');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Client Messages', icon: Users, path: '/admin/messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-white p-2 rounded-md shadow-md text-gray-600 hover:text-primary focus:outline-none"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-display font-bold text-primary">GasRafi Admin</h2>
          <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
        </div>

        <nav className="mt-6">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            <li className="px-6 pt-6">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
