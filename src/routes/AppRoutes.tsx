
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Teachers from '@/pages/Teachers';
import Books from '@/pages/Books';
import Finance from '@/pages/Finance';
import Attendance from '@/pages/Attendance';
import Exams from '@/pages/Exams';
import Schedule from '@/pages/Schedule';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

// Layout components
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

// Auth components
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';
import { UserRole } from '@/types';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Public route wrapper (redirects to dashboard if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Layout wrapper
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 md:pl-64 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

// Role definitions
const ALL_ROLES: UserRole[] = ['student', 'teacher', 'finance', 'controller', 'admin', 'superadmin'];
const STAFF_ROLES: UserRole[] = ['teacher', 'finance', 'controller', 'admin', 'superadmin'];
const ADMIN_ROLES: UserRole[] = ['admin', 'superadmin'];
const FINANCE_ROLES: UserRole[] = ['finance', 'admin', 'superadmin'];
const CONTROLLER_ROLES: UserRole[] = ['controller', 'admin', 'superadmin'];

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        {/* Protected routes with dashboard layout */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Profile page - accessible by all authenticated users */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Role-protected routes */}
        <Route 
          path="/students" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoleProtectedRoute allowedRoles={STAFF_ROLES}>
                  <Students />
                </RoleProtectedRoute>
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/teachers" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoleProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <Teachers />
                </RoleProtectedRoute>
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/books" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Books />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/finance" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoleProtectedRoute allowedRoles={FINANCE_ROLES}>
                  <Finance />
                </RoleProtectedRoute>
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoleProtectedRoute allowedRoles={STAFF_ROLES}>
                  <Attendance />
                </RoleProtectedRoute>
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/exams" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoleProtectedRoute allowedRoles={STAFF_ROLES}>
                  <Exams />
                </RoleProtectedRoute>
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/schedule" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Schedule />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoleProtectedRoute allowedRoles={[...FINANCE_ROLES, 'student']}>
                  <Finance />
                </RoleProtectedRoute>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoleProtectedRoute allowedRoles={CONTROLLER_ROLES}>
                  <Exams />
                </RoleProtectedRoute>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
