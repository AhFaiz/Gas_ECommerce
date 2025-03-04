
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

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
    
    // If we're in development mode, auto-authenticate as admin123 for testing
    if (process.env.NODE_ENV === 'development' && !isAuthenticated) {
      console.log('Development mode - Auto authenticating for testing');
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminUsername', 'admin123');
      toast.info('Auto-login for development enabled');
      window.location.reload(); // Reload to apply the change
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
