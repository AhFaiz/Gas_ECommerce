
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
      
      // Auto-authenticate for admin dashboards
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminUsername', 'admin123');
      
      // Set a Supabase session for the admin user
      const adminLogin = async () => {
        try {
          console.log('Creating anonymous session for development');
          // Create an anonymous session to bypass RLS in development
          const { data, error } = await supabase.auth.signInAnonymously();
          
          if (error) {
            console.error('Unable to create anonymous session:', error);
          } else {
            console.log('Created anonymous session successfully:', data);
          }
        } catch (err) {
          console.error('Error during auto-authentication:', err);
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
