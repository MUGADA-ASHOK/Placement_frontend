import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UnauthorizedPage from './pages/UnauthorizedPage'

import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard'
import SuperAdminAdmins from './pages/super-admin/SuperAdminAdmins'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminCompanies from './pages/admin/AdminCompanies'
import AdminDrives from './pages/admin/AdminDrives'

import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyDrives from './pages/company/CompanyDrives'

import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import StudentDrives from './pages/student/StudentDrives'
import StudentApplications from './pages/student/StudentApplications'

const SA = 'ROLE_SUPER_ADMIN'
const AD = 'ROLE_ADMIN'
const CO = 'ROLE_COMPANY'
const ST = 'ROLE_STUDENT'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Super Admin */}
          <Route element={<ProtectedRoute allowedRoles={[SA]} />}>
            <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/admins" element={<SuperAdminAdmins />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={[AD, SA]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/drives" element={<AdminDrives />} />
          </Route>

          {/* Company */}
          <Route element={<ProtectedRoute allowedRoles={[CO]} />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/drives" element={<CompanyDrives />} />
          </Route>

          {/* Student */}
          <Route element={<ProtectedRoute allowedRoles={[ST]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/drives" element={<StudentDrives />} />
            <Route path="/student/applications" element={<StudentApplications />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
