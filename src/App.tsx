/**
 * Central router configuration and service provider definitions.
 * Employs React Router to configure protected corporate workspaces.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Module Imports
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import EmployeeManagement from './pages/employees/EmployeeManagement';
import DepartmentManagement from './pages/departments/DepartmentManagement';
import AttendanceManagement from './pages/attendance/AttendanceManagement';
import LeaveManagement from './pages/leaves/LeaveManagement';
import PayrollManagement from './pages/payroll/PayrollManagement';
import UserProfile from './pages/profile/UserProfile';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Authenticated Application Shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="departments" element={<DepartmentManagement />} />
              <Route path="attendance" element={<AttendanceManagement />} />
              <Route path="leaves" element={<LeaveManagement />} />
              <Route path="payroll" element={<PayrollManagement />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Public Identity Authentication Pathway */}
            <Route path="/login" element={<Login />} />

            {/* Global Wildcard Fallback redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
