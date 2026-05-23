import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const icons = {
  dashboard: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"/></svg>,
  users: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M7.111 20A3.111 3.111 0 0 1 4 16.889v-12C4 4.398 4.398 4 4.889 4h4.444a.89.89 0 0 1 .89.889v12A3.111 3.111 0 0 1 7.11 20Zm0 0h12a.889.889 0 0 0 .889-.889v-4.444a.889.889 0 0 0-.889-.89h-4.389a.889.889 0 0 0-.62.253l-3.767 3.665a.933.933 0 0 0-.146.185c-.868 1.433-1.581 1.858-3.078 2.12Z"/></svg>,
  building: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 4h12v17H6zm4 4h4m-4 4h4m-4 4h4M6 4H4v17h2M18 4h2v17h-2"/></svg>,
  drive: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4"/></svg>,
  apps: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/></svg>,
  profile: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/></svg>,
  shield: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3L4 7v5c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V7l-8-4z"/></svg>,
}

const navByRole = {
  ROLE_SUPER_ADMIN: [
    { to: '/super-admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/admin/students',        label: 'Students',  icon: 'users' },
    { to: '/admin/companies',       label: 'Companies', icon: 'building' },
    { to: '/admin/drives',          label: 'Drives',    icon: 'drive' },
    { to: '/super-admin/admins',    label: 'Admins',    icon: 'shield' },
  ],
  ROLE_ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/admin/students', label: 'Students', icon: 'users' },
    { to: '/admin/companies', label: 'Companies', icon: 'building' },
    { to: '/admin/drives', label: 'Drives', icon: 'drive' },
  ],
  ROLE_COMPANY: [
    { to: '/company/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/company/drives', label: 'My Drives', icon: 'drive' },
  ],
  ROLE_STUDENT: [
    { to: '/student/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/student/profile', label: 'My Profile', icon: 'profile' },
    { to: '/student/drives', label: 'Eligible Drives', icon: 'drive' },
    { to: '/student/applications', label: 'Applications', icon: 'apps' },
  ],
}

const roleLabels = {
  ROLE_SUPER_ADMIN: 'Super Admin', ROLE_ADMIN: 'Admin',
  ROLE_COMPANY: 'Company', ROLE_STUDENT: 'Student',
}

export default function DashboardLayout({ children }) {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = navByRole[role] || []

  const handleLogout = async () => { await logout(); navigate('/login') }
  const initials = user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 min-h-screen bg-gray-900 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-700">
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">ANITS</p>
          <h2 className="text-white font-bold text-base mt-0.5">Placement Portal</h2>
        </div>
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-gray-400 text-xs">{roleLabels[role]}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }>
              {icons[item.icon]}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-2 py-4 border-t border-gray-700">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all">
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shrink-0">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">ANITS Placement Cell</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
