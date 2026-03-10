import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CourseDetail from './pages/CourseDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

// Student Components
import StudentLayout from './components/student/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import StudentCourses from './pages/student/StudentCourses'
import StudentCertificates from './pages/student/StudentCertificates'
import CoursePlayer from './pages/student/CoursePlayer'

// Admin Components
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCourses from './pages/admin/AdminCourses'

import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminContacts from './pages/admin/AdminContacts'
import AdminDrive from './pages/admin/AdminDrive'
import AdminRoles from './pages/admin/AdminRoles'
import AdminActivityLog from './pages/admin/AdminActivityLog'
import AdminCertificates from './pages/admin/AdminCertificates'
import AdminBadges from './pages/admin/AdminBadges'
import AdminProfile from './pages/admin/AdminProfile'

// Protected Route for Students
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Mock Auth Check
const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('adminToken');
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
          {/* Main Site Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="achievements" element={<StudentCertificates />} />
          </Route>
 
          <Route path="/student/course/:courseId/play" element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          } />
          <Route path="/student/course/:courseId/play/:lectureId" element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          } />

          {/* Admin Secret Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="drive" element={<AdminDrive />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="activity" element={<AdminActivityLog />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="badges" element={<AdminBadges />} />
            <Route path="profile" element={<AdminProfile />} />
            {/* Add other admin sub-routes here as needed */}
          </Route>
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App