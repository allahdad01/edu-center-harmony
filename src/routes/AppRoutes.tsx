
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

// Components
import PublicRoute from '@/routes/PublicRoute';
import ProtectedRoutes from '@/routes/ProtectedRoutes';

export default function AppRoutes() {
  const location = useLocation();

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
