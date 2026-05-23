import { useState, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { studentApi } from '../../api/services'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../../components/ui/Pagination'

const GRADS = [
  'from-indigo-500 to-purple-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-pink-500 to-rose-500'
]

function TiltCard({ drive, onApply, applying }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const onMove = e => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - top) / height - 0.5) * -8, y: ((e.clientX - left) / width - 0.5) * 8 })
  }

  const company  = drive.driveInfo?.companyName || 'Company'
  const role     = drive.driveInfo?.role || '—'
  const pkg      = drive.driveInfo?.packageAmount
  const deadline = drive.driveInfo?.registrationEndDate
  const initials = company.slice(0, 2).toUpperCase()
  const index    = drive.driveId?.length >= 4 ? drive.driveId.charCodeAt(3) : 0
  const grad     = GRADS[Math.abs(index) % GRADS.length]
  const isApplying = applying === drive.driveId

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 0.2s ease-out' }}
      className="rounded-2xl shadow-lg overflow-hidden bg-white select-none">
      <div className={`bg-gradient-to-br ${grad} px-5 py-5 flex flex-col gap-3`}>
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl">{initials}</div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-400/20 text-blue-100">ELIGIBLE</span>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">{company}</h3>
          <p className="text-white/80 text-sm mt-0.5">{role}</p>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-gray-400">Package</p>
            <p className="font-semibold text-gray-800">{pkg ? `${pkg} LPA` : '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-gray-400">Drive ID</p>
            <p className="font-mono text-gray-700 text-xs truncate">{drive.driveId}</p>
          </div>
          {deadline && (
            <div className="bg-amber-50 rounded-lg px-3 py-2 col-span-2 border border-amber-100">
              <p className="text-amber-600 text-xs font-medium">⏰ Registration closes: {new Date(deadline).toLocaleDateString()}</p>
            </div>
          )}
        </div>
        <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">You meet all eligibility criteria</p>
          <button disabled={isApplying} onClick={() => onApply(drive.driveId)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-xs font-medium transition active:scale-95 disabled:opacity-60">
            {isApplying
              ? <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Applying...</>
              : <>Apply Now →</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudentDrives() {
  const fetchFn = useCallback((page, size) => studentApi.getEligibleDrives(page, size), [])
  const { items: drives, loading, error, page, totalPages, totalElements, goToPage, refetch } =
    usePagination(fetchFn, 15)

  const [applying, setApplying] = useState('')
  const [toast,    setToast]    = useState(null)
  const showToast = m => { setToast(m); setTimeout(() => setToast(null), 3000) }

  const handleApply = async (driveId) => {
    setApplying(driveId)
    try {
      await studentApi.applyDrive(driveId)
      showToast('Applied successfully! Check My Applications to track progress.')
      refetch() // re-fetch current page — applied drive disappears
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to apply. Please try again.')
    } finally {
      setApplying('')
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-5">
        <div>
          <h2 className="text-gray-800 font-semibold text-lg">Eligible Drives</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {totalElements != null
              ? `${totalElements} drive${totalElements !== 1 ? 's' : ''} match your profile · click Apply Now to register`
              : 'Drives matching your profile will appear here'}
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3 text-xs text-indigo-700 flex items-start gap-2">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>These are drives you are <strong>eligible</strong> for based on your CGPA, department, and passing year. Click <strong>Apply Now</strong> to formally apply. Once applied, track your progress in <strong>My Applications</strong>.</span>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-700 text-sm font-medium">⚠️ Could not load eligible drives</p>
            <p className="text-amber-600 text-xs mt-1">{error}. Make sure your profile is complete and an admin has published drives.</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
          </div>
        ) : drives.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <p className="text-gray-600 font-medium">No eligible drives at the moment</p>
            <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">Make sure your profile is complete. Drives will appear here once an admin publishes them for your department and batch.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {drives.map(drive => (
                <TiltCard key={drive.driveId} drive={drive} onApply={handleApply} applying={applying} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-2">
                <Pagination page={page} totalPages={totalPages} onPage={goToPage} />
              </div>
            )}
          </>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm flex items-center gap-2.5 shadow-xl z-50">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          {toast}
        </div>
      )}
    </DashboardLayout>
  )
}
