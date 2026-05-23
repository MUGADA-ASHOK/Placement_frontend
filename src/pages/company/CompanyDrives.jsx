import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../../components/ui/Pagination'
import { companyApi } from '../../api/services'

const GRADS = ['from-indigo-600 to-indigo-900', 'from-violet-600 to-violet-900', 'from-slate-700 to-slate-900', 'from-blue-600 to-blue-900', 'from-emerald-600 to-emerald-900']

function Input({ label, hint, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
      <div className="flex items-center border border-gray-300 rounded-full px-4 h-10 focus-within:ring-2 focus-within:ring-indigo-400 overflow-hidden bg-white transition">
        <input className="w-full outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400" {...props} />
      </div>
      {hint && <p className="text-xs text-gray-400 pl-1">{hint}</p>}
    </div>
  )
}

function Badge({ status }) {
  const map = { CLEARED: 'bg-emerald-50 text-emerald-700 border-emerald-200', FAILED: 'bg-red-50 text-red-600 border-red-200', PENDING: 'bg-gray-100 text-gray-600 border-gray-200', APPLIED: 'bg-indigo-50 text-indigo-700 border-indigo-200', INPROCESS: 'bg-amber-50 text-amber-700 border-amber-200', SELECTED: 'bg-emerald-50 text-emerald-700 border-emerald-200', REJECTED: 'bg-red-50 text-red-600 border-red-200', SHORTLISTED: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
  return <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${map[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{status}</span>
}

// ── VIEW: Drive List ──────────────────────────────────────────────
function DriveListView({ drives, loading, error, onSelectDrive, page, totalPages, onPage }) {
  if (loading) return <div className="flex items-center justify-center py-20"><svg className="w-7 h-7 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>
  if (error) return <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-700 text-sm">{error}</div>
  if (!Array.isArray(drives) || drives.length === 0) return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
      </div>
      <p className="text-gray-500 font-medium">No drives assigned</p>
      <p className="text-gray-400 text-sm mt-1">Ask admin to create a drive for your company.</p>
    </div>
  )
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {drives.map((drive, i) => {
        const grad = GRADS[i % GRADS.length]
        const initials = (drive.driveName || 'DR').slice(0, 2).toUpperCase()
        return (
          <div key={drive.driveId} onClick={() => onSelectDrive(drive)}
            className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-indigo-400 transition-all select-none">
            <div className={`bg-gradient-to-br ${grad} px-5 py-5 flex flex-col gap-3`}>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">{initials}</div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${drive.isActive ? 'bg-emerald-400/20 text-emerald-100' : 'bg-white/10 text-white/60'}`}>
                  {drive.isActive ? 'ACTIVE' : 'CLOSED'}
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">{drive.driveName}</h3>
                <p className="text-white/80 text-sm mt-0.5">{drive.jobRole}</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-gray-400">Package</p>
                  <p className="font-semibold text-gray-800">{drive.packageOffered} LPA</p>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-gray-400">Location</p>
                  <p className="font-semibold text-gray-800 truncate">{drive.jobLocation}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <span>Closes {drive.registrationEndDate}</span>
                <span className="text-indigo-500 font-medium">Click to manage →</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── VIEW: Drive Rounds ─────────────────────────────────────────────
function DriveRoundsView({ drive, rounds, roundsLoading, onBack, onAddRound, onSelectRound, activeRoundId }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6"/></svg>
          My Drives
        </button>
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
        <span className="text-gray-800 font-semibold">{drive.driveName}</span>
      </div>

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Drive Rounds</p>
          <h2 className="text-white font-bold text-lg mt-0.5">{drive.driveName}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{drive.jobRole} · {drive.packageOffered} LPA · {drive.jobLocation}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs">Max Rounds</p>
          <p className="text-white text-2xl font-bold">{drive.maxRounds}</p>
          <p className="text-slate-400 text-xs">{rounds?.length || 0} published</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{rounds?.length || 0} round{rounds?.length !== 1 ? 's' : ''} configured · click a round card to manage applicants</p>
        {(rounds?.length || 0) < (drive.maxRounds || 99) && (
          <button onClick={onAddRound}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Round
          </button>
        )}
      </div>

      {roundsLoading ? (
        <div className="flex items-center justify-center py-12"><svg className="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>
      ) : !Array.isArray(rounds) || rounds.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p className="text-gray-500 font-medium text-sm">No rounds published yet</p>
          <p className="text-gray-400 text-xs mt-1">Click "Add Round" to publish the first round.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rounds.map(r => {
            const isActive = activeRoundId === r.id
            return (
              <div key={r.id} onClick={() => onSelectRound(r)}
                className={`bg-white rounded-2xl border-2 p-5 cursor-pointer hover:shadow-md transition-all ${isActive ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent border border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    {r.roundNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">{r.roundName}</p>
                    <p className="text-xs text-gray-400">{r.roundDate}</p>
                  </div>
                </div>
                {r.roundLink && (
                  <a href={r.roundLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs text-indigo-500 hover:underline mb-3">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    Round Link
                  </a>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {isActive ? '● Selected' : 'Click to manage →'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Resume Preview Modal ──────────────────────────────────────────
// Fetches PDF via backend proxy (/api/company/viewResume/{rollNo}) → blob URL → iframe.
// Blob URLs are always same-origin so the browser renders inline, never downloads.
function ResumeModal({ student, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const filename = `${student.studentRollNo}_resume.pdf`

 useEffect(() => {
  let url = null

  if (!student?.studentRollNo) return

  companyApi.viewStudentResume(student.studentRollNo)
    .then(res => {
      url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      setBlobUrl(url)
    })
    .catch(() => setLoadError(true))

  return () => {
    if (url) URL.revokeObjectURL(url)
  }
}, [student?.studentRollNo])

  const handleDownload = () => {
    if (!blobUrl) return
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {student.studentName?.[0] || '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{student.studentName}</p>
              <p className="text-xs text-gray-400 font-mono">{student.studentRollNo} · {student.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {blobUrl && (
              <button onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 font-medium transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Download ({filename})
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Student info strip */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
          <div className="flex flex-wrap gap-5 text-xs text-gray-500">
            <span><span className="font-medium text-gray-700">CGPA:</span> <span className={`font-bold ${student.currentCgpa >= 8 ? 'text-emerald-600' : student.currentCgpa >= 7 ? 'text-amber-600' : 'text-red-500'}`}>{student.currentCgpa}</span></span>
            <span><span className="font-medium text-gray-700">Mobile:</span> {student.mobileNo}</span>
            <span><span className="font-medium text-gray-700">Email:</span> {student.email}</span>
            <span><span className="font-medium text-gray-700">Score:</span> <span className="text-indigo-600 font-semibold">{student.score ?? '—'}</span></span>
            <span><span className="font-medium text-gray-700">Status:</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                student.status === 'CLEARED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                student.status === 'FAILED' ? 'bg-red-50 text-red-600 border-red-200' :
                'bg-gray-100 text-gray-600 border-gray-200'
              }`}>{student.status}</span>
            </span>
          </div>
        </div>

        {/* PDF via blob — renders inline, never triggers download */}
        <div className="flex-1 overflow-hidden rounded-b-2xl" style={{ minHeight: '460px' }}>
          {!blobUrl && !loadError && (
            <div className="flex items-center justify-center h-64">
              <svg className="w-7 h-7 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </div>
          )}
          {loadError && (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <p className="text-gray-500 font-medium text-sm">No resume uploaded</p>
              <p className="text-gray-400 text-xs mt-1">This student hasn't uploaded a resume yet.</p>
            </div>
          )}
          {blobUrl && (
            <iframe
              src={blobUrl}
              className="w-full h-full"
              style={{ minHeight: '460px', border: 'none' }}
              title={`${student.studentName} Resume`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── VIEW: Round Applicants ────────────────────────────────────────
function RoundApplicantsView({ drive, round, rows, loading, onBack, onSaveScore, onShortlist, onFilterTopK, onFilterCutoff, scoreInputs, setScoreInputs, topK, setTopK, cutoff, setCutoff, showToast }) {
  const [viewStudent, setViewStudent] = useState(null)
  const [resumeStudent, setResumeStudent] = useState(null)
 const safeRows = Array.isArray(rows) ? rows : []

const scored = safeRows.filter(
  r => r.score !== null && r.score !== undefined
)

const totalStudents = safeRows.length

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <button onClick={() => onBack('drives')} className="text-gray-500 hover:text-indigo-600 transition">My Drives</button>
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
        <button onClick={() => onBack('rounds')} className="text-gray-500 hover:text-indigo-600 transition">{drive.driveName}</button>
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
        <span className="text-gray-800 font-semibold">Round {round.roundNumber} – {round.roundName}</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          ['Total', totalStudents, 'text-gray-700'],
          ['Pending', safeRows?.filter(r => r.status === 'PENDING').length || 0, 'text-blue-600'],
          ['Cleared', safeRows?.filter(r => r.status === 'CLEARED').length || 0, 'text-emerald-600'],
          ['Failed', safeRows?.filter(r => r.status === 'FAILED').length || 0, 'text-red-500'],
        ].map(([l, v, cls]) => (
          <div key={l} className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
            <p className={`text-xl font-bold ${cls}`}>{v}</p>
            <p className="text-xs text-gray-400 mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Filter panel */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Top-K — number input, range 1 to total students in this round */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">Shortlist by Top-K</p>
          <p className="text-xs text-gray-400 mb-3">
            CLEARED for top K, FAILED for rest · {scored.length} scored · {totalStudents} total
          </p>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="number"
              min={1}
              max={totalStudents || 1}
              value={topK}
              onChange={e => {
                const val = parseInt(e.target.value, 10)
                if (!isNaN(val)) setTopK(Math.min(Math.max(1, val), totalStudents || 1))
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24 outline-none focus:border-indigo-400 text-gray-800 font-semibold"
            />
            <span className="text-xs text-gray-400">
              of {totalStudents} student{totalStudents !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={() => onFilterTopK(drive.driveId, round.roundNumber)}
            disabled={totalStudents === 0}
            className="px-4 py-1.5 text-xs bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-medium disabled:opacity-40">
            Apply Top-{topK}
          </button>
        </div>

        {/* Cutoff — unchanged */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">Shortlist by Cutoff</p>
          <p className="text-xs text-gray-400 mb-3">CLEARED if score ≥ {cutoff} · {scored.filter(r => r.score >= cutoff).length} qualify</p>
          <div className="flex items-center gap-3 mb-3">
            <input type="range" min={0} max={100} step={1} value={cutoff}
              onChange={e => setCutoff(+e.target.value)} className="flex-1 accent-indigo-600" />
            <span className="text-lg font-bold text-indigo-600 w-8 text-center">{cutoff}</span>
          </div>
          <button onClick={() => onFilterCutoff(drive.driveId, round.roundNumber)}
            className="px-4 py-1.5 text-xs bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-medium">
            Apply Cutoff {cutoff}
          </button>
        </div>
      </div>

      {/* Applicants table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-white text-xs text-gray-500 font-semibold uppercase tracking-wide">
              {['Applicant', 'Dept', 'CGPA', 'Mobile', 'Resume', 'Score', 'Feedback', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} className="text-center py-10 text-gray-400 text-sm">
                <svg className="w-5 h-5 animate-spin text-indigo-500 inline mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                Loading applicants...
              </td></tr>
            )}
            {!loading && !rows?.length && (
              <tr><td colSpan={9} className="text-center py-10 text-gray-400 text-sm">No applicants for this round.</td></tr>
            )}
            {rows?.map((r, idx) => {
              const rowKey = r.applicationId ?? idx
              const sk = `${drive.driveId}_${round.roundNumber}_${r.studentRollNo}`
              const hasResume = !!(r.resume)
              return (
                <tr key={rowKey} className={`border-t border-gray-100 hover:bg-gray-50 transition ${r.status === 'FAILED' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800 text-sm">{r.studentName || '—'}</p>
                    <p className="text-xs text-gray-400 font-mono">{r.studentRollNo}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.department || '—'}</td>
                  <td className="px-4 py-3">
                    {r.currentCgpa != null
                      ? <span className={`font-semibold text-sm ${r.currentCgpa >= 8 ? 'text-emerald-600' : r.currentCgpa >= 7 ? 'text-amber-600' : 'text-red-500'}`}>{r.currentCgpa}</span>
                      : <span className="text-gray-300 text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.mobileNo || '—'}</td>
                  <td className="px-4 py-3">
                    {hasResume ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => setResumeStudent(r)} title="Preview resume"
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 font-medium transition whitespace-nowrap">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          View
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300 italic">No resume</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex flex-col">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder={r.score != null ? String(r.score) : '0-100'}
                          value={scoreInputs[sk] ?? (r.score != null ? r.score : '')}
                          onChange={e => setScoreInputs(p => ({ ...p, [sk]: e.target.value }))}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-xs w-16 outline-none focus:border-indigo-400 bg-white text-gray-700"
                        />
                        <span className="text-[10px] text-gray-300 mt-0.5">0 – 100</span>
                      </div>
                      <button onClick={() => onSaveScore(drive.driveId, round.roundNumber, r.studentRollNo, sk)}
                        title="Save score"
                        className="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 max-w-[120px] truncate" title={r.feedback || ''}>
                    {r.feedback || '—'}
                  </td>
                  <td className="px-4 py-3"><Badge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => onShortlist(drive.driveId, round.roundNumber, r.studentRollNo, 'CLEARED')}
                        title="Mark CLEARED"
                        className={`p-1.5 rounded-lg transition ${r.status === 'CLEARED' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
                      </button>
                      <button onClick={() => onShortlist(drive.driveId, round.roundNumber, r.studentRollNo, 'FAILED')}
                        title="Mark FAILED"
                        className={`p-1.5 rounded-lg transition ${r.status === 'FAILED' ? 'bg-red-100 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500'}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
                      </button>
                      <button onClick={() => setViewStudent(r)} title="View profile"
                        className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Score Leaderboard */}
      {scored.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Score Leaderboard</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 font-semibold">
                {['#', 'Student', 'Roll No', 'CGPA', 'Score', 'Status', 'Resume'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...scored].sort((a, b) => b.score - a.score).map((r, i) => (
                <tr key={r.applicationId ?? i} className="border-t border-gray-100">
                  <td className="px-4 py-2.5 text-xs text-gray-400 font-bold">{i + 1}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800 text-xs">{r.studentName}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-400">{r.studentRollNo}</td>
                  <td className="px-4 py-2.5 text-gray-600 text-xs">{r.currentCgpa}</td>
                  <td className="px-4 py-2.5 font-bold text-indigo-600">{r.score}</td>
                  <td className="px-4 py-2.5"><Badge status={r.status} /></td>
                  <td className="px-4 py-2.5">
                    {r.resume ? (
                      <button onClick={() => setResumeStudent(r)}
                        className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 font-medium">View</button>
                    ) : <span className="text-xs text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student profile quick-view modal */}
      {viewStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setViewStudent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  {viewStudent.studentName?.[0] || '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{viewStudent.studentName}</p>
                  <p className="text-xs text-gray-400 font-mono">{viewStudent.studentRollNo}</p>
                </div>
              </div>
              <button onClick={() => setViewStudent(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                ['Department', viewStudent.department],
                ['CGPA', viewStudent.currentCgpa],
                ['Mobile', viewStudent.mobileNo],
                ['Email', viewStudent.email],
                ['Score (this round)', viewStudent.score ?? '—'],
                ['Status', viewStudent.status],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800">{v ?? '—'}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Resume</p>
                {viewStudent.resume ? (
                  <button onClick={() => { setResumeStudent(viewStudent); setViewStudent(null) }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-medium transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    Preview PDF
                  </button>
                ) : (
                  <p className="text-xs text-gray-400 italic">No resume uploaded by this student.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Preview Modal */}
      {resumeStudent && (
        <ResumeModal student={resumeStudent} onClose={() => setResumeStudent(null)} />
      )}
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────
export default function CompanyDrives() {
  const { items: _drives, loading, error, page: drivesPage, totalPages: drivesTotalPages, goToPage: drivesGoToPage } = usePagination((page, size) => companyApi.getAllDrives(page, size), 15)

const drives = _drives
  ? data
  : data?.data?.content ?? data?.content ?? data?.body?.content ?? data?.payload?.content ?? data?.data ?? data?.body ?? data?.payload ?? data?.drives ?? []
  const [view, setView] = useState('list')
  const [selectedDrive, setSelectedDrive] = useState(null)
  const [selectedRound, setSelectedRound] = useState(null)
  const [rounds, setRounds] = useState([])
  const [roundsLoading, setRoundsLoading] = useState(false)
  const [allAppRounds, setAllAppRounds] = useState({})
  const [roundAppsLoading, setRoundAppsLoading] = useState(false)
  const [scoreInputs, setScoreInputs] = useState({})
  const [topK, setTopK] = useState(1)
  const [cutoff, setCutoff] = useState(70)
  const [showRoundModal, setShowRoundModal] = useState(false)
  const [roundForm, setRoundForm] = useState({ roundName: '', roundDate: '', roundLink: '' })
  const [actionLoading, setActionLoading] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = m => { setToast(m); setTimeout(() => setToast(null), 3500) }

  const getAppRoundsKey = (driveId, roundNo) => `${driveId}_${roundNo}`
  const getAppRounds = (driveId, roundNo) => allAppRounds[getAppRoundsKey(driveId, roundNo)] || []
  const setAR = (driveId, roundNo, updater) =>
    setAllAppRounds(prev => {
      const k = getAppRoundsKey(driveId, roundNo)
      const cur = prev[k] || []
      return { ...prev, [k]: typeof updater === 'function' ? updater(cur) : updater }
    })

 const handleSelectDrive = async (drive) => {
  setSelectedDrive(drive)
  setView('rounds')
  setRoundsLoading(true)

  try {
    const res = await companyApi.getRounds(drive.driveId)

    const body = res.data?.data ?? res.data
    const list = body?.content ?? body ?? []

    setRounds(Array.isArray(list) ? list : [])
  } catch {
    setRounds([])
  } finally {
    setRoundsLoading(false)
  }
}

  const handleSelectRound = async (round) => {
  setSelectedRound(round)
  setView('applicants')

  const key = getAppRoundsKey(selectedDrive.driveId, round.roundNumber)
  if (allAppRounds[key]) return

  setRoundAppsLoading(true)

  try {
    const res = await companyApi.getApplicationsByRound(
      selectedDrive.driveId,
      round.roundNumber
    )

    const body = res.data?.data ?? res.data
    const list = body?.content ?? body ?? []

    const safeList = Array.isArray(list) ? list : []

    setAR(selectedDrive.driveId, round.roundNumber, safeList)
    setTopK(Math.max(1, safeList.length || 1))
  } catch {
    setAR(selectedDrive.driveId, round.roundNumber, [])
  } finally {
    setRoundAppsLoading(false)
  }
}

  const handlePublishRound = async () => {
    if (!roundForm.roundName || !roundForm.roundDate) { showToast('Round name and date required'); return }
    setActionLoading('round')
    try {
      const nextNo = (rounds?.length || 0) + 1
      await companyApi.publishRound(selectedDrive.driveId, { ...roundForm, roundNumber: nextNo })
      showToast('Round published!')
      setShowRoundModal(false)
      setRoundForm({ roundName: '', roundDate: '', roundLink: '' })
      const res = await companyApi.getRounds(selectedDrive.driveId)
      const body = res.data?.data ?? res.data
const list = body?.content ?? body ?? []

setRounds(Array.isArray(list) ? list : [])
    } catch (err) { showToast(err.response?.data?.message || 'Failed to publish round') }
    finally { setActionLoading('') }
  }

  const handleSaveScore = async (driveId, roundNo, rollNo, sk) => {
    const val = parseFloat(scoreInputs[sk])
    if (isNaN(val)) { showToast('Enter a valid score'); return }
    try {
      await companyApi.publishScore(driveId, rollNo, roundNo, val)
      setAR(driveId, roundNo, prev => prev.map(r => r.studentRollNo === rollNo ? { ...r, score: val } : r))
      showToast(`Score ${val} saved for ${rollNo}`)
    } catch (err) { showToast(err.response?.data?.message || 'Failed to save score') }
  }

  const handleShortlist = async (driveId, roundNo, rollNo, status) => {
    try {
      const rows = getAppRounds(driveId, roundNo)
      const row = rows.find(r => r.studentRollNo === rollNo)
      if (row?.score === null && status === 'CLEARED') {
        showToast('Please enter a score before shortlisting'); return
      }
      if (status === 'CLEARED') {
        await companyApi.publishScore(driveId, rollNo, roundNo, row?.score ?? 0)
      }
      setAR(driveId, roundNo, prev => prev.map(r => r.studentRollNo === rollNo ? { ...r, status } : r))
      showToast(`${rollNo} marked as ${status}`)
    } catch (err) { showToast(err.response?.data?.message || 'Failed to update status') }
  }

  const handleFilterTopK = async (driveId, roundNo) => {
  try {
    await companyApi.filterTopK(driveId, roundNo, topK)

    const res = await companyApi.getApplicationsByRound(driveId, roundNo)

    const body = res.data?.data ?? res.data
    const list = body?.content ?? body ?? []

    setAR(driveId, roundNo, Array.isArray(list) ? list : [])

    showToast(`Top ${topK} students shortlisted!`)
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to filter')
  }
}

 const handleFilterCutoff = async (driveId, roundNo) => {
  try {
    await companyApi.filterByCutoff(driveId, roundNo, cutoff)

    const res = await companyApi.getApplicationsByRound(driveId, roundNo)

    const body = res.data?.data ?? res.data
    const list = body?.content ?? body ?? []

    setAR(driveId, roundNo, Array.isArray(list) ? list : [])

    showToast(`Cutoff ${cutoff} applied!`)
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to apply cutoff')
  }
}
  const handleBack = (target) => {
    if (target === 'rounds') { setView('rounds'); setSelectedRound(null) }
    else { setView('list'); setSelectedDrive(null); setSelectedRound(null); setRounds([]) }
  }

  const currentAppRounds = selectedDrive && selectedRound
    ? getAppRounds(selectedDrive.driveId, selectedRound.roundNumber)
    : []

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-gray-800 font-semibold text-lg">
            {view === 'list' ? 'My Drives' : view === 'rounds' ? selectedDrive?.driveName : `Round ${selectedRound?.roundNumber} — ${selectedRound?.roundName}`}
          </h2>
          {view === 'list' && <p className="text-gray-400 text-sm mt-0.5">{drives?.length || 0} drives assigned to your company</p>}
        </div>

        {view === 'list' && (
          <DriveListView drives={drives} loading={loading} error={error} onSelectDrive={handleSelectDrive} page={drivesPage} totalPages={drivesTotalPages} onPage={drivesGoToPage} />
        )}
        {view === 'rounds' && selectedDrive && (
          <DriveRoundsView
            drive={selectedDrive} rounds={rounds} roundsLoading={roundsLoading}
            onBack={() => handleBack('list')} onAddRound={() => setShowRoundModal(true)}
            onSelectRound={handleSelectRound} activeRoundId={selectedRound?.id}
          />
        )}
        {view === 'applicants' && selectedDrive && selectedRound && (
          <RoundApplicantsView
            drive={selectedDrive} round={selectedRound} rows={currentAppRounds}
            loading={roundAppsLoading} onBack={handleBack}
            onSaveScore={handleSaveScore} onShortlist={handleShortlist}
            onFilterTopK={handleFilterTopK} onFilterCutoff={handleFilterCutoff}
            scoreInputs={scoreInputs} setScoreInputs={setScoreInputs}
            topK={topK} setTopK={setTopK} cutoff={cutoff} setCutoff={setCutoff}
            showToast={showToast}
          />
        )}
      </div>

      {/* Add Round Modal */}
      {showRoundModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowRoundModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Publish Round {(rounds?.length || 0) + 1}</h3>
              <p className="text-xs text-gray-400 mt-0.5">DriveRoundDto · POST /api/company/publishDriveRound/{selectedDrive?.driveId}</p>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Round Name" value={roundForm.roundName} onChange={e => setRoundForm(p => ({ ...p, roundName: e.target.value }))} placeholder="e.g. Online Assessment, Technical Interview" />
              <Input label="Round Date" type="date" value={roundForm.roundDate} onChange={e => setRoundForm(p => ({ ...p, roundDate: e.target.value }))} hint="YYYY-MM-DD" />
              <Input label="Round Link (optional)" value={roundForm.roundLink} onChange={e => setRoundForm(p => ({ ...p, roundLink: e.target.value }))} placeholder="https://hackerrank.com/..." />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowRoundModal(false)} className="flex-1 h-10 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handlePublishRound} disabled={actionLoading === 'round'}
                  className="flex-1 h-10 bg-indigo-600 rounded-full text-sm text-white hover:bg-indigo-700 disabled:opacity-60">
                  {actionLoading === 'round' ? 'Publishing...' : 'Publish Round'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm flex items-center gap-2.5 shadow-xl z-50">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
          {toast}
        </div>
      )}
    </DashboardLayout>
  )
}