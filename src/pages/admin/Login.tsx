
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting admin login for:', username);
      
      // Simple admin credential check (NOT SECURE - demo only)
      // In a real app, this should verify against hashed passwords in the database
      if (username === 'admin123' && password === 'admin123') {
        console.log('Admin credentials validated');
        
        // Set the admin session in localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminUsername', username);
        
        // Authenticate with Supabase to bypass RLS
        try {
          // Try to sign in with email/password (if you've created this user)
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@example.com',
            password: 'admin123'
          });
          
          if (error) {
            console.log('Unable to login with Supabase, creating anonymous session instead');
            // If no admin user exists, create an anonymous session
            await supabase.auth.signInAnonymously();
          } else {
            console.log('Logged in with Supabase auth:', data);
          }
        } catch (err) {
          console.error('Error during Supabase authentication:', err);
          // Fallback to anonymous session
          await supabase.auth.signInAnonymously();
        }
        
        toast.success('Login successful!');
        navigate(from, { replace: true });
      } else {
        console.log('Invalid admin credentials');
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the admin dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary/30 focus:border-primary"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary/30 focus:border-primary"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <p className="text-gray-500">
              Hello Admin !! Hope Have a Good Day :))
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
