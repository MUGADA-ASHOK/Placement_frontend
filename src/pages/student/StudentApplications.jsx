import { useCallback, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { studentApi } from '../../api/services'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../../components/ui/Pagination'

const STATUS_GRAD = {
  APPLIED:     'from-indigo-500 to-indigo-600',
  INPROCESS:   'from-amber-500 to-amber-600',
  SELECTED:    'from-emerald-500 to-emerald-600',
  REJECTED:    'from-red-400 to-red-500',
  SHORTLISTED: 'from-yellow-500 to-yellow-600',
}

function Badge({ status }) {
  const map = {
    CLEARED:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    FAILED:   'bg-red-50 text-red-600 border-red-200',
    PENDING:  'bg-gray-100 text-gray-600 border-gray-200',
    APPLIED:  'bg-indigo-50 text-indigo-700 border-indigo-200',
    INPROCESS:'bg-amber-50 text-amber-700 border-amber-200',
    SELECTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-50 text-red-600 border-red-200',
  }
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{status}</span>
}

function CircleProgress({ status }) {
  const pct   = status === 'SELECTED' ? 100 : status === 'INPROCESS' ? 65 : status === 'APPLIED' ? 30 : 0
  const isRej = status === 'REJECTED'
  const color = isRej ? '#ef4444' : pct === 100 ? '#10b981' : '#6366f1'
  const C     = 2 * Math.PI * 36
  const dash  = (pct / 100) * C
  return (
    <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
      <svg className="absolute inset-0 w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill={isRej ? '#fee2e2' : '#ede9fe'} />
        <circle cx="40" cy="40" r="36" fill="none" stroke={isRej ? '#fecaca' : '#ddd6fe'} strokeWidth="8" />
        <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${C - dash}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      </svg>
      <div className="relative flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-sm">
        {isRej
          ? <span className="text-red-500 font-bold text-lg">✕</span>
          : pct === 100
          ? <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
          : <span className="font-bold text-sm" style={{ color }}>{pct}%</span>
        }
      </div>
    </div>
  )
}

const STEPS = ['APPLIED', 'INPROCESS', 'SELECTED']
function StepTracker({ status }) {
  if (status === 'REJECTED') return (
    <div className="flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold shrink-0">✕</span>
      <span className="text-sm font-medium text-red-600">Application Rejected</span>
    </div>
  )
  const cur = STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${i <= cur ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${i <= cur ? 'bg-indigo-500' : 'bg-gray-300'}`} />
            {s}
          </div>
          {i < STEPS.length - 1 && <div className={`h-px w-4 ${i < cur ? 'bg-indigo-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )
}

function RoundDetailModal({ app, rounds, loading, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h3 className="font-semibold text-gray-800">Round-wise Results</h3>
            <p className="text-xs text-gray-400 mt-0.5">{app.driveInfo?.companyName || app.driveId} · {app.driveInfo?.role || '—'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge status={app.status} />
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
          {app.driveInfo?.packageAmount && <span>💰 {app.driveInfo.packageAmount} LPA</span>}
          {app.appliedAt && <span>📅 Applied: {app.appliedAt}</span>}
          {app.currentRound > 0 && <span>🔄 Current Round: {app.currentRound}</span>}
          {app.offerAccepted && <span className="text-emerald-600 font-medium">✓ Offer Accepted</span>}
        </div>
        <div className="px-6 py-4 border-b border-gray-100"><StepTracker status={app.status} /></div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <svg className="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            </div>
          ) : !rounds?.length ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm font-medium">No rounds yet</p>
              <p className="text-gray-400 text-xs mt-1">The company will publish rounds and results will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rounds.map((r, i) => {
                const isCleared = r.status === 'CLEARED'
                const isFailed  = r.status === 'FAILED'
                return (
                  <div key={r.applicationId ?? i}
                    className={`flex items-start gap-4 p-4 rounded-xl border ${isCleared ? 'bg-emerald-50 border-emerald-200' : isFailed ? 'bg-red-50 border-red-200 opacity-75' : 'bg-gray-50 border-gray-200'}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${isCleared ? 'bg-emerald-100 text-emerald-700' : isFailed ? 'bg-red-100 text-red-500' : 'bg-indigo-100 text-indigo-700'}`}>
                      {isCleared
                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
                        : isFailed
                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
                        : <span>{i + 1}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">Round {i + 1}</p>
                        <Badge status={r.status || 'PENDING'} />
                        {app.currentRound === i + 1 && !isCleared && !isFailed && (
                          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">Current Round</span>
                        )}
                      </div>
                      {(r.score != null || r.feedback) ? (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {r.score != null && (
                            <div className="bg-white border border-gray-100 rounded-lg px-4 py-2.5 text-center min-w-[80px]">
                              <p className="text-xs text-gray-400">Your Score</p>
                              <p className={`text-xl font-bold mt-0.5 ${r.score >= 70 ? 'text-emerald-600' : r.score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{r.score}</p>
                              <p className="text-xs text-gray-400">/ 100</p>
                            </div>
                          )}
                          {r.feedback && (
                            <div className="bg-white border border-gray-100 rounded-lg px-4 py-2.5 flex-1 min-w-[140px]">
                              <p className="text-xs text-gray-400">Feedback</p>
                              <p className="text-sm text-gray-700 mt-0.5 font-medium">{r.feedback}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic mt-2">
                          {r.status === 'PENDING' ? 'Awaiting results from the company.' : 'No score/feedback provided.'}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StudentApplications() {
  const fetchFn = useCallback((page, size) => studentApi.getApplications(page, size), [])
  const { items: applications, loading, error, page, totalPages, totalElements, goToPage } =
    usePagination(fetchFn, 10)

  const [selectedApp,   setSelectedApp]   = useState(null)
  const [rounds,        setRounds]        = useState(null)
  const [roundsLoading, setRoundsLoading] = useState(false)

  const openRounds = async (app) => {
    setSelectedApp(app)
    setRoundsLoading(true)
    try {
      const res = await studentApi.getRoundsForDrive(app.driveId)
      const body = res.data?.data ?? res.data
      const content = body?.content ?? (Array.isArray(body) ? body : [])
      setRounds(content)
    } catch { setRounds([]) }
    finally { setRoundsLoading(false) }
  }

  const handleClose = () => { setSelectedApp(null); setRounds(null) }

  // Status counts across the current page items
  const applied   = applications.filter(a => a.status === 'APPLIED').length
  const inProcess = applications.filter(a => a.status === 'INPROCESS').length
  const selected  = applications.filter(a => a.status === 'SELECTED').length
  const rejected  = applications.filter(a => a.status === 'REJECTED').length

  if (loading && applications.length === 0) return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-20">
        <svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="p-8 space-y-5">
        <div>
          <h2 className="text-gray-800 font-semibold text-lg">My Applications</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {totalElements != null ? `${totalElements} application${totalElements !== 1 ? 's' : ''}` : '—'}
            {' · '}click a card for round-by-round results
          </p>
        </div>

        {applications.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {[
              ['Applied',    applied,   'text-indigo-600',  'bg-indigo-50'],
              ['In Process', inProcess, 'text-amber-600',   'bg-amber-50'],
              ['Selected',   selected,  'text-emerald-600', 'bg-emerald-50'],
              ['Rejected',   rejected,  'text-red-500',     'bg-red-50'],
            ].map(([l, v, cls, bg]) => (
              <div key={l} className={`${bg} rounded-xl border border-gray-200 px-4 py-3 text-center`}>
                <p className={`text-xl font-bold ${cls}`}>{v}</p>
                <p className="text-xs text-gray-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}

        {applications.length === 0 && !error ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">Go to <span className="text-indigo-500 font-medium">Eligible Drives</span> and click Apply Now.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((a, i) => {
                const grad = STATUS_GRAD[a.status] || 'from-gray-400 to-gray-500'
                return (
                  <div key={a.id || i} onClick={() => openRounds(a)}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-indigo-200 transition cursor-pointer">
                    <div className={`bg-gradient-to-r ${grad} px-5 py-4 flex items-center justify-between`}>
                      <div>
                        <p className="text-white font-bold text-base">{a.driveInfo?.companyName || a.driveId}</p>
                        <p className="text-white/80 text-xs mt-0.5">{a.driveInfo?.role || '—'}</p>
                      </div>
                      <div className="text-right">
                        {a.driveInfo?.packageAmount && <p className="text-white font-bold text-lg">{a.driveInfo.packageAmount} LPA</p>}
                        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">{a.status}</span>
                      </div>
                    </div>
                    <div className="px-5 py-4 flex items-center gap-5">
                      <CircleProgress status={a.status} />
                      <div className="flex-1 min-w-0">
                        <StepTracker status={a.status} />
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                          {a.appliedAt && <span>📅 {a.appliedAt}</span>}
                          {a.currentRound > 0 && <span>🔄 Round {a.currentRound}</span>}
                          {a.offerAccepted && <span className="text-emerald-600 font-medium">✓ Offer Accepted</span>}
                        </div>
                        <p className="text-xs text-indigo-500 mt-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
                          Click to see round results
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
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

      {selectedApp && (
        <RoundDetailModal app={selectedApp} rounds={rounds} loading={roundsLoading} onClose={handleClose} />
      )}
    </DashboardLayout>
  )
}
