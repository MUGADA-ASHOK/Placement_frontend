import { useState, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../../components/ui/Pagination'
import { superAdminApi, authApi } from '../../api/services'

function Input({ label, hint, showEye, error, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
      <div className={`flex items-center border rounded-full px-4 h-10 focus-within:ring-2 focus-within:ring-indigo-400 overflow-hidden transition ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}>
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
      {error && <p className="text-xs text-red-600 pl-1">{error}</p>}
    </div>
  )
}

export default function SuperAdminAdmins() {
  const fetchFn = useCallback((page, size) => superAdminApi.getAllAdmins(page, size), [])
  const { items: admins, loading, error, page, totalPages, totalElements, goToPage, refetch } =
    usePagination(fetchFn, 2)

  const [modal, setModal]               = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast]               = useState(null)
  const [actionLoading, setActionLoading] = useState('')
  const [adminForm, setAdminForm]       = useState({ name: '', email: '', password: '' })

  const showToast = (m, type = 'success') => {
    setToast({ m, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleRegister = async () => {
    if (!adminForm.name || !adminForm.email || !adminForm.password) {
      showToast('All fields required', 'error'); return
    }
    setActionLoading('register')
    try {
      await authApi.registerAdmin(adminForm)
      showToast('Admin registered successfully!')
      setAdminForm({ name: '', email: '', password: '' })
      setModal('')
      refetch()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to register admin', 'error')
    } finally { setActionLoading('') }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setActionLoading('delete')
    try {
      await superAdminApi.deleteAdmin(deleteTarget.id)
      showToast(`Admin "${deleteTarget.name}" deleted successfully`)
      setDeleteTarget(null)
      setModal('')
      refetch()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete admin', 'error')
    } finally { setActionLoading('') }
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-800 font-semibold text-lg">Manage Admins</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {totalElements != null ? `${totalElements} admin${totalElements !== 1 ? 's' : ''} registered` : 'Loading…'}
            </p>
          </div>
          <button
            onClick={() => { setAdminForm({ name: '', email: '', password: '' }); setModal('register') }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Register Admin
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}

        {/* Admins Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-7 h-7 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : !admins?.length ? (
          <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-2xl">🛡️</div>
            <p className="font-semibold text-gray-700">No admins registered yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "Register Admin" to add the first placement cell admin.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-white text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  {['#', 'Name', 'Email', 'Role', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, i) => (
                  <tr key={admin.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-5 py-3 text-xs text-gray-400 font-mono">{page * 15 + i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                          {(admin.name || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{admin.email}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium border bg-indigo-50 text-indigo-700 border-indigo-200">
                        {admin.role || 'ROLE_ADMIN'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => { setDeleteTarget(admin); setModal('delete') }}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs bg-red-50 text-red-600 rounded-full hover:bg-red-100 font-medium border border-red-200 transition"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-gray-100 flex justify-center">
                <Pagination page={page} totalPages={totalPages} onPage={goToPage} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Register Admin Modal */}
      {modal === 'register' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModal('')}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Register New Admin</h3>
              <p className="text-xs text-gray-400 mt-0.5">Add a placement cell administrator</p>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Full Name" value={adminForm.name} onChange={e => setAdminForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Dr. Ravi Kumar" />
              <Input label="Email" type="email" value={adminForm.email} onChange={e => setAdminForm(p => ({ ...p, email: e.target.value }))} placeholder="ravi@anits.edu.in" />
              <Input label="Password" showEye value={adminForm.password} onChange={e => setAdminForm(p => ({ ...p, password: e.target.value }))} placeholder="min 8 characters" hint="Min 8 characters" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal('')} className="flex-1 h-10 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button onClick={handleRegister} disabled={actionLoading === 'register'}
                  className="flex-1 h-10 bg-indigo-600 rounded-full text-sm text-white hover:bg-indigo-700 disabled:opacity-60 transition">
                  {actionLoading === 'register' ? 'Registering...' : 'Register'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal === 'delete' && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => { setModal(''); setDeleteTarget(null) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-center text-base">Delete Admin?</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Are you sure you want to delete <span className="font-semibold text-gray-700">{deleteTarget.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setModal(''); setDeleteTarget(null) }} className="flex-1 h-10 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button onClick={handleDelete} disabled={actionLoading === 'delete'}
                  className="flex-1 h-10 bg-red-600 rounded-full text-sm text-white hover:bg-red-700 disabled:opacity-60 transition">
                  {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm flex items-center gap-2.5 shadow-xl z-50 ${toast.type === 'error' ? 'bg-red-700' : 'bg-gray-900'} text-white`}>
          {toast.type === 'error'
            ? <svg className="w-4 h-4 text-red-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
          }
          {toast.m}
        </div>
      )}
    </DashboardLayout>
  )
}
