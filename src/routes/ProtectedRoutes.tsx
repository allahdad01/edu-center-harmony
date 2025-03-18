
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';
import { UserRole } from '@/types';

// Pages
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Teachers from '@/pages/Teachers';
import Books from '@/pages/Books';
import Finance from '@/pages/Finance';
import Attendance from '@/pages/Attendance';
import Exams from '@/pages/Exams';
import Schedule from '@/pages/Schedule';
import Profile from '@/pages/Profile';

// Layout components
import DashboardLayout from '@/routes/DashboardLayout';

// Role definitions
const ALL_ROLES: UserRole[] = ['student', 'teacher', 'finance', 'controller', 'admin', 'superadmin'];
const STAFF_ROLES: UserRole[] = ['teacher', 'finance', 'controller', 'admin', 'superadmin'];
const ADMIN_ROLES: UserRole[] = ['admin', 'superadmin'];
const FINANCE_ROLES: UserRole[] = ['finance', 'admin', 'superadmin'];
const CONTROLLER_ROLES: UserRole[] = ['controller', 'admin', 'superadmin'];

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected route wrapper
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

export default function ProtectedRoutes() {
  return (
    <Routes>
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
    </Routes>
  );
}
