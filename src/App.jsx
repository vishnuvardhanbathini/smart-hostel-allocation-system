import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { ProtectedRoute, RoleBasedRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HostelDetails from './pages/HostelDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageHostels from './pages/admin/ManageHostels';
import ManageRooms from './pages/admin/ManageRooms';
import Applications from './pages/admin/Applications';
import SmartAllocation from './pages/admin/SmartAllocation';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminNotices from './pages/admin/AdminNotices';
import Reports from './pages/admin/Reports';

// Warden Pages
import WardenDashboard from './pages/warden/WardenDashboard';
import WardenRooms from './pages/warden/WardenRooms';
import WardenStudents from './pages/warden/WardenStudents';
import WardenComplaints from './pages/warden/WardenComplaints';
import WardenNotices from './pages/warden/WardenNotices';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import ApplyHostel from './pages/student/ApplyHostel';
import ApplicationStatus from './pages/student/ApplicationStatus';
import RoomDetails from './pages/student/RoomDetails';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentNotices from './pages/student/StudentNotices';
import Notifications from './pages/student/Notifications';

export default function App() {
  return (
    <BrowserRouter>
      <DatabaseProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              
              {/* Public Views */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/hostel/:id" element={<HostelDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected Authenticated Dashboards */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  
                  {/* Admin Protected Routes */}
                  <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<ManageStudents />} />
                    <Route path="/admin/hostels" element={<ManageHostels />} />
                    <Route path="/admin/rooms" element={<ManageRooms />} />
                    <Route path="/admin/applications" element={<Applications />} />
                    <Route path="/admin/smart-allocation" element={<SmartAllocation />} />
                    <Route path="/admin/complaints" element={<AdminComplaints />} />
                    <Route path="/admin/notices" element={<AdminNotices />} />
                    <Route path="/admin/reports" element={<Reports />} />
                  </Route>

                  {/* Warden Protected Routes */}
                  <Route element={<RoleBasedRoute allowedRoles={['warden']} />}>
                    <Route path="/warden/dashboard" element={<WardenDashboard />} />
                    <Route path="/warden/rooms" element={<WardenRooms />} />
                    <Route path="/warden/students" element={<WardenStudents />} />
                    <Route path="/warden/complaints" element={<WardenComplaints />} />
                    <Route path="/warden/notices" element={<WardenNotices />} />
                  </Route>

                  {/* Student Protected Routes */}
                  <Route element={<RoleBasedRoute allowedRoles={['student']} />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                    <Route path="/student/apply" element={<ApplyHostel />} />
                    <Route path="/student/status" element={<ApplicationStatus />} />
                    <Route path="/student/application-status" element={<ApplicationStatus />} />
                    <Route path="/student/room-details" element={<RoomDetails />} />
                    <Route path="/student/complaints" element={<StudentComplaints />} />
                    <Route path="/student/notices" element={<StudentNotices />} />
                    <Route path="/student/notifications" element={<Notifications />} />
                  </Route>

                </Route>
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </ToastProvider>
        </AuthProvider>
      </DatabaseProvider>
    </BrowserRouter>
  );
}
