
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  const adminUsername = localStorage.getItem('adminUsername');

  // Make sure it's the admin account
  const isAdmin = adminUsername === 'admin123';
  
  if (!isAuthenticated || !isAdmin) {
    // Redirect to login page if not authenticated as admin
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
