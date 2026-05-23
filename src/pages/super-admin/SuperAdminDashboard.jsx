import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useFetch } from '../../hooks/useFetch'
import { adminApi, authApi, superAdminApi } from '../../api/services'
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
          {value == null
            ? <span className="w-12 h-6 bg-gray-100 rounded animate-pulse inline-block" />
            : value}
        </p>
      </div>
    </div>
  )
}

function Input({ label, hint, showEye, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
      <div className="flex items-center border border-gray-300 bg-white rounded-full px-4 h-10 focus-within:ring-2 focus-within:ring-indigo-400 overflow-hidden transition">
        <input {...props} type={showEye ? (show ? 'text' : 'password') : props.type}
          className="w-full outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400" />
        {showEye && (
          <button type="button" onClick={() => setShow(s => !s)} className="text-gray-400 hover:text-gray-600 ml-2 shrink-0">
            {show
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            }
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400 pl-1">{hint}</p>}
    </div>
  )
}

export default function SuperAdminDashboard() {
  const { user } = useAuth()

  // ── Count endpoints — avoids fetching full paginated lists just for a number ──
  const { data: studentCount }      = useFetch(adminApi.countStudents)
  const { data: companyCount }      = useFetch(adminApi.countCompanies)
  const { data: activedriveCount }  = useFetch(adminApi.countActiveDrives)
  const { data: adminCount, refetch: refetchAdminCount } = useFetch(adminApi.countAdmins)

  // Admin list (small, no pagination needed — typically < 20 admins)
  const { data: admins, refetch: refetchAdmins } = useFetch(superAdminApi.getAllAdmins)

  // Active drives preview list (List<DriveDto> — not paginated)
  const { data: drives } = useFetch(adminApi.getAllActiveDrives)

  const [modal,         setModal]         = useState('')
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  const [adminForm,     setAdminForm]     = useState({ name: '', email: '', password: '' })
  const [actionLoading, setActionLoading] = useState('')
  const [toast,         setToast]         = useState(null)

  const showToast = (m, type = 'success') => {
    setToast({ m, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleRegisterAdmin = async () => {
    if (!adminForm.name || !adminForm.email || !adminForm.password) {
      showToast('All fields required', 'error'); return
    }
    setActionLoading('reg')
    try {
      await authApi.registerAdmin(adminForm)
      showToast('Admin registered successfully!')
      setAdminForm({ name: '', email: '', password: '' })
      setModal('')
      refetchAdmins()
      refetchAdminCount()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to register admin', 'error')
    } finally { setActionLoading('') }
  }

  const handleDeleteAdmin = async () => {
    if (!deleteTarget) return
    setActionLoading('del')
    try {
      await superAdminApi.deleteAdmin(deleteTarget.id)
      showToast('Admin deleted.')
      setModal('')
      setDeleteTarget(null)
      refetchAdmins()
      refetchAdminCount()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete admin', 'error')
    } finally { setActionLoading('') }
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm flex items-center gap-2.5 shadow-xl z-50 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}>
            {toast.type === 'error'
              ? <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              : <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            }
            {toast.m}
          </div>
        )}

        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl px-7 py-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute right-16 -bottom-12 w-56 h-56 bg-indigo-500/10 rounded-full" />
          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Super Admin</p>
            <h2 className="text-white text-xl font-bold mt-0.5">{user?.email?.split('@')[0] || 'SuperAdmin'}</h2>
            <p className="text-slate-400 text-sm mt-1">Super Administrator · ANITS Placement Cell</p>
          </div>
          <div className="relative z-10 hidden md:flex items-center gap-6">
            {[
              ['Students',      studentCount,     'text-blue-400'],
              ['Companies',     companyCount,     'text-indigo-400'],
              ['Active Drives', activedriveCount, 'text-emerald-400'],
              ['Admins',        adminCount,       'text-rose-400'],
            ].map(([l, v, c]) => (
              <div key={l} className="text-center">
                <p className={`text-2xl font-bold ${c}`}>{v == null ? '…' : v}</p>
                <p className="text-slate-400 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={studentCount} color="indigo"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
          />
          <StatCard label="Active Drives" value={activedriveCount} color="emerald"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
          />
          <StatCard label="Companies" value={companyCount} color="amber"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
          />
          <StatCard label="Admins" value={adminCount} color="rose"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
          />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/admin/students',       label: 'Manage Students', icon: '👥', color: 'indigo' },
            { to: '/admin/companies',      label: 'Companies',       icon: '🏢', color: 'emerald' },
            { to: '/admin/drives',         label: 'Manage Drives',   icon: '📋', color: 'amber' },
            { to: '/super-admin/admins',   label: 'Manage Admins',   icon: '🛡️', color: 'rose' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-indigo-200 transition group">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-indigo-500 transition">View all →</p>
            </Link>
          ))}
        </div>

        {/* Admins list */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-sm">Admins ({admins?.length ?? '…'})</h3>
            <button onClick={() => setModal('registerAdmin')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-medium transition">
              + Add Admin
            </button>
          </div>
          {!admins?.length ? (
            <p className="text-gray-400 text-sm text-center py-6">No admins found.</p>
          ) : (
            <div className="space-y-2">
              {admins.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {(a.name || a.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { setDeleteTarget(a); setModal('deleteAdmin') }}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active drives preview */}
        {drives?.length > 0 && (
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
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Register Admin Modal */}
      {modal === 'registerAdmin' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModal('')}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-800">Register New Admin</h3>
            <Input label="Name" placeholder="Full name" value={adminForm.name}
              onChange={e => setAdminForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Email" type="email" placeholder="admin@anits.edu.in" value={adminForm.email}
              onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="Password" showEye placeholder="Min 8 characters" value={adminForm.password}
              onChange={e => setAdminForm(f => ({ ...f, password: e.target.value }))} />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal('')}
                className="flex-1 py-2 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleRegisterAdmin} disabled={actionLoading === 'reg'}
                className="flex-1 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
                {actionLoading === 'reg' ? 'Registering…' : 'Register Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal === 'deleteAdmin' && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModal('')}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-800">Delete Admin?</h3>
            <p className="text-sm text-gray-500">
              Remove <strong>{deleteTarget.name}</strong> ({deleteTarget.email}) from the system? This cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal('')}
                className="flex-1 py-2 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleDeleteAdmin} disabled={actionLoading === 'del'}
                className="flex-1 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-60">
                {actionLoading === 'del' ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}