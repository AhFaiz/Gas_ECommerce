
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  const adminUsername = localStorage.getItem('adminUsername');
  
  // Debug info when mounting this component
  useEffect(() => {
    console.log('ProtectedAdminRoute - Auth check:', { 
      isAuthenticated, 
      adminUsername, 
      path: location.pathname 
    });
    
    // If we're in development mode, auto-authenticate and set RLS bypass session
    if (process.env.NODE_ENV === 'development' && !isAuthenticated) {
      console.log('Development mode - Auto authenticating for testing');
      
      // Auto-authenticate
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminUsername', 'admin123');
      
      // Set a Supabase session for the admin user
      const adminLogin = async () => {
        try {
          // Try to sign in as a special admin user to bypass RLS
          // This is only for development purposes
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@example.com',
            password: 'admin123'
          });
          
          if (error) {
            console.log('Unable to auto-login with Supabase, creating anonymous session instead');
            // If no admin user exists, create an anonymous session
            await supabase.auth.signInAnonymously();
          } else {
            console.log('Auto-logged in with Supabase auth:', data);
          }
        } catch (err) {
          console.error('Error during auto-authentication:', err);
          // Fallback to anonymous session
          await supabase.auth.signInAnonymously();
        }
      };
      
      adminLogin();
      toast.info('Auto-login for development enabled');
    }
  }, [location.pathname]);

  // Make sure it's the admin account - but any username is allowed in development
  const isAdmin = process.env.NODE_ENV === 'development' || adminUsername === 'admin123';
  
  if (!isAuthenticated || !isAdmin) {
    // Redirect to login page if not authenticated as admin
    console.log('Admin authentication failed, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
