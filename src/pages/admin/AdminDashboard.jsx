import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useFetch } from '../../hooks/useFetch'
import { adminApi } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

function StatCard({ label, value, color, icon }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color] || colors.indigo}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-semibold text-gray-800 mt-0.5">
          {value == null ? <span className="w-12 h-6 bg-gray-100 rounded animate-pulse inline-block" /> : value}
        </p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, role } = useAuth()
  const isSA = role === 'ROLE_SUPER_ADMIN'

  // Use dedicated count endpoints — avoids loading full paginated lists just for a number
  const { data: studentCount }  = useFetch(adminApi.countStudents)
  const { data: companyCount }  = useFetch(adminApi.countCompanies)
  const { data: activeCount }   = useFetch(adminApi.countActiveDrives)
  const { data: adminCount }    = useFetch(adminApi.countAdmins)

  // Still need the list for the "Active Drives" preview section — but only first page
  const { data: drivesPage } = useFetch(() => adminApi.getAllActiveDrives())
  // getAllActiveDrives returns List<DriveDto> (not paginated per backend), so keep as-is
  const drives = drivesPage ?? []

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl px-7 py-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute right-16 -bottom-12 w-56 h-56 bg-indigo-500/10 rounded-full" />
          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Placement Cell</p>
            <h2 className="text-white text-xl font-bold mt-0.5">{user?.email?.split('@')[0] || 'Admin'}</h2>
            <p className="text-slate-400 text-sm mt-1">{isSA ? 'Super Administrator' : 'Placement Admin'} · ANITS</p>
          </div>
          <div className="relative z-10 hidden md:flex items-center gap-6">
            {[
              ['Active Drives', activeCount, 'text-emerald-400'],
              ['Companies',    companyCount, 'text-indigo-400'],
              ['Students',     studentCount, 'text-blue-400'],
            ].map(([l, v, c]) => (
              <div key={l} className="text-center">
                <p className={`text-2xl font-bold ${c}`}>
                  {v == null ? '…' : v}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-4 ${isSA ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
          <StatCard label="Total Students" value={studentCount} color="indigo"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
          />
          <StatCard label="Active Drives" value={activeCount} color="emerald"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
          />
          <StatCard label="Companies" value={companyCount} color="amber"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
          />
          {isSA && (
            <StatCard label="Total Admins" value={adminCount} color="rose"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
            />
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/admin/students',          label: 'Manage Students', icon: '👥', color: 'indigo' },
            { to: '/admin/companies',          label: 'Companies',       icon: '🏢', color: 'emerald' },
            { to: '/admin/drives',             label: 'Manage Drives',   icon: '📋', color: 'amber' },
            ...(isSA ? [{ to: '/super-admin/admins', label: 'Manage Admins', icon: '🛡️', color: 'rose' }] : []),
          ].map(item => (
            <Link key={item.to} to={item.to} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-indigo-200 transition group">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-indigo-500 transition">View all →</p>
            </Link>
          ))}
        </div>

        {/* Recent drives preview */}
        {drives.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm">Active Drives</h3>
              <Link to="/admin/drives" className="text-xs text-indigo-500 hover:underline">Manage all</Link>
            </div>
            <div className="space-y-3">
              {drives.slice(0, 5).map(d => (
                <div key={d.driveId} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(d.companyId || 'CO').slice(-2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{d.driveName}</p>
                    <p className="text-xs text-gray-400">{d.jobRole} · {d.packageOffered} LPA</p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}