import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import SuperAdminSetup from '@/pages/SuperAdminSetup';

// Components
import PublicRoute from '@/routes/PublicRoute';
import ProtectedRoutes from '@/routes/ProtectedRoutes';
import { AuthService } from '@/services/auth';

export default function AppRoutes() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [needsSuperAdmin, setNeedsSuperAdmin] = useState(false);

  // Check if we need to set up a super admin on first run
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        setIsLoading(true);
        const hasSuperAdmin = await AuthService.checkSuperAdminExists();
        setNeedsSuperAdmin(!hasSuperAdmin);
      } catch (error) {
        console.error('Error checking for super admin:', error);
        // Assume we need setup if there's an error
        setNeedsSuperAdmin(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSuperAdmin();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (needsSuperAdmin) {
    return <SuperAdminSetup />;
  }

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      
      {/* All protected routes */}
      <Route path="/*" element={<ProtectedRoutes />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
