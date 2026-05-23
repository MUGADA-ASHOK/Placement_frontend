import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../../components/ui/Pagination'
import { adminApi, authApi } from '../../api/services'

/* ─── Shared mini UI ──────────────────────────────────────────── */
function Badge({ status }) {
  const map = { ELIGIBLE: 'bg-blue-50 text-blue-700 border-blue-200', APPLIED: 'bg-indigo-50 text-indigo-700 border-indigo-200', INPROCESS: 'bg-amber-50 text-amber-700 border-amber-200', SELECTED: 'bg-emerald-50 text-emerald-700 border-emerald-200', REJECTED: 'bg-red-50 text-red-600 border-red-200', CLEARED: 'bg-emerald-50 text-emerald-700 border-emerald-200', FAILED: 'bg-red-50 text-red-600 border-red-200', PENDING: 'bg-gray-100 text-gray-600 border-gray-200', ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200', CLOSED: 'bg-gray-100 text-gray-500 border-gray-200', SHORTLISTED: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{status}</span>
}
function Spinner() { return <svg className="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> }
function Input({ label, hint, showEye, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
      <div className="flex items-center border border-gray-300 rounded-full px-4 h-10 bg-white focus-within:ring-2 focus-within:ring-indigo-400 overflow-hidden transition">
        <input {...props} type={showEye ? (show ? 'text' : 'password') : (props.type || 'text')} className="w-full outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400" />
        {showEye && (
          <button type="button" onClick={() => setShow(s => !s)} className="ml-2 text-gray-400 hover:text-gray-600 shrink-0">
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
function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>}
          {item.onClick
            ? <button onClick={item.onClick} className="text-indigo-500 hover:text-indigo-700 font-medium hover:underline">{item.label}</button>
            : <span className="text-gray-800 font-semibold">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}
function EligibilityBtn({ driveId, onClick, actionLoading }) {
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    adminApi.isDrivePublished(driveId)
      .then(res => setIsPublished(res.data?.data ?? res.data))
      .catch(() => setIsPublished(false))
      .finally(() => setLoading(false))
  }, [driveId, actionLoading])
  if (loading) return <span className="text-xs text-gray-400">...</span>
  if (isPublished) return <button onClick={onClick} className="flex items-center gap-1 text-xs text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full hover:bg-violet-100 font-medium border border-violet-200 transition">Update Eligibility</button>
  return <button onClick={onClick} className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full hover:bg-amber-100 font-medium border border-amber-200 transition"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Set Eligibility</button>
}
const downloadPdf = async (url, filename) => {
  try {
    const res = await fetch(url); const blob = new Blob([await res.arrayBuffer()], { type: 'application/pdf' })
    const blobUrl = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = blobUrl; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
  } catch { window.open(url, '_blank') }
}
function ResumePreviewModal({ url, studentName, rollNo, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null)
  useEffect(() => {
    if (!url) return; let active = true
    fetch(url).then(res => res.arrayBuffer()).then(buf => { if (!active) return; setBlobUrl(URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }))) }).catch(() => { if (active) setBlobUrl(url) })
    return () => { active = false }
  }, [url])
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div><p className="font-semibold text-gray-800">{studentName} — Resume</p><p className="text-xs text-gray-400 font-mono">{rollNo}</p></div>
          <div className="flex items-center gap-2">
            <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 font-medium">Open in Tab</a>
            <button onClick={() => downloadPdf(url, `${rollNo}_resume.pdf`)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 font-medium">Download</button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
        </div>
        <div className="flex-1 min-h-0">{blobUrl ? <iframe src={`${blobUrl}#toolbar=1&navpanes=0&scrollbar=1`} className="w-full h-full min-h-[500px]" title="Resume Preview" /> : <div className="flex flex-col items-center justify-center h-full min-h-[500px]"><Spinner /></div>}</div>
      </div>
    </div>
  )
}
function StudentProfileModal({ student, profile, loading, onClose, onViewResume }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">{student.name?.[0]}{student.surname?.[0]}</div>
            <div><p className="font-semibold text-gray-800">{student.name} {student.surname}</p><p className="text-xs text-gray-400 font-mono">{student.rollNo}</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            {[['Email', student.email], ['Mobile', student.mobileNo]].map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-lg p-3 col-span-2"><p className="text-gray-400">{k}</p><p className="font-medium text-gray-800 mt-0.5">{v || '—'}</p></div>
            ))}
          </div>
          {loading ? <div className="flex items-center justify-center py-8"><Spinner /></div>
            : !profile ? <div className="text-center py-6 text-gray-400 text-sm">Profile not created yet.</div>
            : (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Academic Profile</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[['Department', profile.department], ['Gender', profile.gender], ['CGPA', profile.currentCgpa], ['Semester', profile.currentSemester], ['10th %', profile.tenthPercentage != null ? profile.tenthPercentage + '%' : '—'], ['12th %', profile.twelthPercentage != null ? profile.twelthPercentage + '%' : '—'], ['Active Backlogs', profile.backlogCount], ['Passing Year', profile.passingYear]].map(([k, v]) => (
                    <div key={k} className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">{k}</p><p className="font-semibold text-sm text-gray-800 mt-0.5">{v ?? '—'}</p></div>
                  ))}
                </div>
                <div className="flex gap-2 mb-4">
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium ${profile.hasBacklogHistory ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{profile.hasBacklogHistory ? '⚠ Has backlog history' : '✓ No backlog history'}</div>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Resume</p>
                {profile.resumeUrl ? (
                  <div className="flex gap-2">
                    <button onClick={() => onViewResume(profile.resumeUrl)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-medium transition">Preview PDF</button>
                    <button onClick={() => downloadPdf(profile.resumeUrl, `${student.rollNo}_resume.pdf`)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-medium transition">Download PDF</button>
                  </div>
                ) : <p className="text-xs text-gray-400 italic bg-gray-50 rounded-xl px-4 py-3">No resume uploaded by this student.</p>}
              </>
            )}
        </div>
      </div>
    </div>
  )
}

/* ─── MAIN ────────────────────────────────────────────────────── */
const GRADS = ['from-indigo-500 to-indigo-700', 'from-violet-500 to-violet-700', 'from-blue-500 to-blue-700', 'from-emerald-500 to-emerald-700', 'from-rose-500 to-rose-700', 'from-amber-500 to-amber-600', 'from-slate-600 to-slate-800']
const BRANCHES = 'CSE,ECE,EEE,CHEM,IT,CSM,CSD,MECH,CIVIL'.split(',')

// ── Helper: extract PageResponse content + pagination ──────────
function extractPage(res) {
  const body = res.data?.data ?? res.data
  return {
    content:       body?.content ?? (Array.isArray(body) ? body : []),
    totalPages:    body?.totalPages ?? 0,
    hasNext:       body?.hasNext ?? false,
    hasPrevious:   body?.hasPrevious ?? false,
  }
}

export default function AdminCompanies() {
  // ── Companies (paginated via hook) ─────────────────────────────
  const companiesFetch = useCallback((page, size) => adminApi.getAllCompanies(page, size), [])
  const { items: companies, loading: coLoading, error: coError, page: coPage, totalPages: coTotalPages, totalElements: coTotal, goToPage: coGoToPage, refetch: refetchCo } =
    usePagination(companiesFetch, 15)

  // ── Drill-down navigation state ────────────────────────────────
  const [view, setView]                   = useState('companies')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedDrive,   setSelectedDrive]   = useState(null)
  const [selectedRound,   setSelectedRound]   = useState(null)

  // ── Drives (manual pagination) ─────────────────────────────────
  const [drives,      setDrives]      = useState([])
  const [drivesPage,  setDrivesPage]  = useState(0)
  const [drivesTotalPages, setDrivesTotalPages] = useState(0)
  const [drivesTotal, setDrivesTotal] = useState(0)
  const [dataLoading, setDataLoading] = useState(false)

  // ── Rounds ─────────────────────────────────────────────────────
  const [rounds, setRounds] = useState([])

  // ── Applicants (manual pagination) ────────────────────────────
  const [applicants,        setApplicants]        = useState([])
  const [applicantsPage,    setApplicantsPage]    = useState(0)
  const [applicantsTotalPg, setApplicantsTotalPg] = useState(0)
  const [applicantsTotal,   setApplicantsTotal]   = useState(0)

  // ── Student profile / resume modals ───────────────────────────
  const [viewStudent,    setViewStudent]    = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [resumeUrl,  setResumeUrl]  = useState(null)
  const [resumeMeta, setResumeMeta] = useState(null)

  // ── Toast / modals ─────────────────────────────────────────────
  const [toast,     setToast]     = useState(null)
  const [showCoForm, setShowCoForm] = useState(false)
  const [coFrm, setCoFrm] = useState({ companyId: '', companyName: '', email: '', password: '', website: '', industryType: '', description: '', externalApplicationLink: '' })
  const [coSaving, setCoSaving] = useState(false)
  const [eligModal, setEligModal] = useState(null)
  const [eligFrm, setEligFrm] = useState({ minimumCgpa: '', maxActiveBacklogs: '', allowedBranch: 'CSE', passingYear: '', gender: 'BOTH', hasHistoryBacklogs: false })
  const [eligSaving, setEligSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState('')

  const showToast = m => { setToast(m); setTimeout(() => setToast(null), 3500) }

  /* ── Navigation helpers ─────────────────────────────────────── */
  const goCompanies = () => { setView('companies'); setSelectedCompany(null); setSelectedDrive(null); setSelectedRound(null); setDrives([]); setRounds([]) }
  const goDrives    = () => { setView('drives'); setSelectedDrive(null); setSelectedRound(null) }
  const goRounds    = () => { setView('rounds'); setSelectedRound(null) }

  /* ── Data loaders ───────────────────────────────────────────── */
  const loadDrives = async (company, page = 0) => {
    setSelectedCompany(company); setView('drives'); setDataLoading(true)
    try {
      const res = await adminApi.getCompanyDrives(company.companyId, page, 10)
      const { content, totalPages, hasNext } = extractPage(res)
      setDrives(content); setDrivesPage(page)
      setDrivesTotalPages(totalPages)
    } catch { setDrives([]) }
    finally { setDataLoading(false) }
  }

  const loadDrivesPage = p => loadDrives(selectedCompany, p)

  const loadRounds = async (drive) => {
    setSelectedDrive(drive); setView('rounds'); setDataLoading(true)
    try {
      const res = await adminApi.getDriveRounds(drive.driveId, 0, 50)
      const { content } = extractPage(res)
      setRounds(content)
    } catch { setRounds([]) }
    finally { setDataLoading(false) }
  }

  const loadApplicants = async (round, page = 0) => {
    setSelectedRound(round); setView('applicants'); setDataLoading(true)
    try {
      const res = await adminApi.getApplicantsForRound(selectedDrive.driveId, round.roundNumber, page, 15)
      const { content, totalPages } = extractPage(res)
      setApplicants(content); setApplicantsPage(page); setApplicantsTotalPg(totalPages)
    } catch { setApplicants([]) }
    finally { setDataLoading(false) }
  }

  const loadApplicantsPage = p => {
    setDataLoading(true)
    adminApi.getApplicantsForRound(selectedDrive.driveId, selectedRound.roundNumber, p, 15)
      .then(res => {
        const { content, totalPages } = extractPage(res)
        setApplicants(content); setApplicantsPage(p); setApplicantsTotalPg(totalPages)
      })
      .catch(() => {})
      .finally(() => setDataLoading(false))
  }

  const openStudentProfile = async (applicant) => {
    const studentBasic = { rollNo: applicant.studentRollNo, name: applicant.studentName?.split(' ')[0] || '', surname: applicant.studentName?.split(' ').slice(1).join(' ') || '', email: applicant.email, mobileNo: applicant.mobileNo }
    setViewStudent({ student: studentBasic, profile: null }); setProfileLoading(true)
    try { const res = await adminApi.getStudentProfile(applicant.studentRollNo); setViewStudent({ student: studentBasic, profile: res.data?.data ?? res.data }) }
    catch { setViewStudent({ student: studentBasic, profile: null }) }
    finally { setProfileLoading(false) }
  }

  /* ── Company Actions ────────────────────────────────────────── */
  const handleRegisterCompany = async () => {
    if (!coFrm.companyId || !coFrm.companyName || !coFrm.email || !coFrm.password) { showToast('Company ID, Name, Email and Password required'); return }
    setCoSaving(true)
    try { await authApi.registerCompany(coFrm); showToast(`Company "${coFrm.companyName}" registered!`); setCoFrm({ companyId: '', companyName: '', email: '', password: '', website: '', industryType: '', description: '', externalApplicationLink: '' }); setShowCoForm(false); refetchCo() }
    catch (err) { showToast(err.response?.data?.message || 'Failed to register company') }
    finally { setCoSaving(false) }
  }
  const handlePublishDrive = async (driveId) => {
    setActionLoading('pub' + driveId)
    try { await adminApi.publishDrive(driveId); showToast('Drive published! Eligible students can now see it.'); loadDrives(selectedCompany, drivesPage) }
    catch (err) { showToast(err.response?.data?.message || 'Failed to publish') }
    finally { setActionLoading('') }
  }
  const handleCloseDrive = async (driveId) => {
    setActionLoading('cls' + driveId)
    try { await adminApi.closeDrive(driveId); showToast('Drive closed.'); loadDrives(selectedCompany, drivesPage) }
    catch (err) { showToast(err.response?.data?.message || 'Failed to close') }
    finally { setActionLoading('') }
  }
  const toggleBranch = b => setEligFrm(p => { const cur = p.allowedBranch.split(',').map(x => x.trim()).filter(Boolean); return { ...p, allowedBranch: (cur.includes(b) ? cur.filter(x => x !== b) : [...cur, b]).join(',') } })
  const handleSaveEligibility = async () => {
    if (!eligFrm.minimumCgpa || !eligFrm.passingYear) { showToast('CGPA and Passing Year required'); return }
    setEligSaving(true)
    try { await adminApi.addEligibility({ driveId: eligModal, minimumCgpa: Number(eligFrm.minimumCgpa), maxActiveBacklogs: Number(eligFrm.maxActiveBacklogs || 0), allowedBranch: eligFrm.allowedBranch, passingYear: Number(eligFrm.passingYear), gender: eligFrm.gender, hasHistoryBacklogs: Boolean(eligFrm.hasHistoryBacklogs) }); showToast('Eligibility saved!'); setEligModal(null); loadDrives(selectedCompany, drivesPage) }
    catch (err) { showToast(err.response?.data?.message || 'Failed to save eligibility') }
    finally { setEligSaving(false) }
  }

  /* ─── RENDER VIEWS ──────────────────────────────────────────── */

  const renderCompanies = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-800 font-semibold text-lg">{coTotal != null ? `${coTotal} Companies` : 'Companies'}</h2>
          <p className="text-gray-400 text-sm mt-0.5">Click a company to see its drives and manage rounds</p>
        </div>
        <button onClick={() => setShowCoForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Register Company
        </button>
      </div>
      {coError && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-5">{coError}</div>}
      {coLoading ? (
        <div className="flex items-center justify-center py-20"><Spinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map((c, i) => {
              const grad = GRADS[i % GRADS.length]
              return (
                <div key={c.companyId} onClick={() => loadDrives(c)} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 cursor-pointer transition-all group">
                  <div className={`bg-gradient-to-r ${grad} px-5 py-5`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl">{c.companyName?.slice(0, 2).toUpperCase()}</div>
                      <div><p className="text-white font-bold text-base">{c.companyName}</p><p className="text-white/70 text-xs">{c.industryType || '—'}</p></div>
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    <p className="text-xs text-gray-500 line-clamp-2">{c.description || 'No description.'}</p>
                    <div className="text-xs text-gray-400 space-y-0.5">
                      <p><code className="bg-gray-100 px-1.5 py-0.5 rounded">{c.companyId}</code></p>
                      {c.website && <p className="truncate">{c.website}</p>}
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Click to manage drives →</span>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>
              )
            })}
            {!companies.length && !coLoading && <div className="col-span-3 text-center py-16 text-gray-400 text-sm">No companies registered yet.</div>}
          </div>

          {coTotalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination page={coPage} totalPages={coTotalPages} onPage={coGoToPage} />
            </div>
          )}
        </>
      )}
    </div>
  )

  const renderDrives = () => (
    <div>
      <Breadcrumb items={[{ label: 'Companies', onClick: goCompanies }, { label: selectedCompany?.companyName }]} />
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl px-6 py-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Company</p>
          <h2 className="text-white font-bold text-xl mt-0.5">{selectedCompany?.companyName}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{selectedCompany?.industryType || '—'} · {selectedCompany?.companyId}</p>
        </div>
        <div className="text-right"><p className="text-slate-400 text-xs">Total Drives</p><p className="text-white text-3xl font-bold">{drivesTotal}</p></div>
      </div>
      {dataLoading ? <div className="flex items-center justify-center py-16"><Spinner /></div>
        : !drives.length ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No drives for {selectedCompany?.companyName}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gradient-to-r from-indigo-50 to-white text-xs text-gray-500 font-semibold uppercase tracking-wide">{['Drive', 'Role', 'Package', 'Location', 'End Date', 'Status', 'Eligibility', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {drives.map(d => (
                    <tr key={d.driveId} className="border-t border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3"><button onClick={() => loadRounds(d)} className="text-left group"><p className="font-semibold text-indigo-600 hover:text-indigo-800 text-sm group-hover:underline">{d.driveName}</p><p className="text-gray-400 text-xs font-mono">{d.driveId}</p></button></td>
                      <td className="px-4 py-3 text-xs text-gray-600">{d.jobRole}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600 text-xs">{d.packageOffered} LPA</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{d.jobLocation}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{d.registrationEndDate}</td>
                      <td className="px-4 py-3"><Badge status={d.isActive ? 'ACTIVE' : 'CLOSED'} /></td>
                      <td className="px-4 py-3"><EligibilityBtn driveId={d.driveId} actionLoading={actionLoading} onClick={() => { setEligModal(d.driveId); setEligFrm(d.eligibility ? { ...d.eligibility } : { minimumCgpa: '', maxActiveBacklogs: '', allowedBranch: 'CSE', passingYear: '', gender: 'BOTH', hasHistoryBacklogs: false }) }} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          <button onClick={() => loadRounds(d)} className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 border border-indigo-200 font-medium">Rounds</button>
                          {!d.isActive && <button onClick={() => handlePublishDrive(d.driveId)} disabled={actionLoading === 'pub' + d.driveId} className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 border border-emerald-200 font-medium disabled:opacity-50">{actionLoading === 'pub' + d.driveId ? '...' : 'Publish'}</button>}
                          {d.isActive && <button onClick={() => handleCloseDrive(d.driveId)} disabled={actionLoading === 'cls' + d.driveId} className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 rounded-full hover:bg-amber-100 border border-amber-200 font-medium disabled:opacity-50">{actionLoading === 'cls' + d.driveId ? '...' : 'Close'}</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {drivesTotalPages > 1 && (
                <div className="px-4 py-4 border-t border-gray-100 flex justify-center">
                  <Pagination page={drivesPage} totalPages={drivesTotalPages} onPage={loadDrivesPage} />
                </div>
              )}
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-xs text-blue-700">
              <span className="font-semibold">Admin Flow:</span> Add Drive → <strong>Set Eligibility</strong> → <strong>Publish Drive</strong> → Students apply → Company scores & shortlists
            </div>
          </>
        )}
    </div>
  )

  const renderRounds = () => (
    <div>
      <Breadcrumb items={[{ label: 'Companies', onClick: goCompanies }, { label: selectedCompany?.companyName, onClick: goDrives }, { label: selectedDrive?.driveName }]} />
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl px-6 py-5 mb-6 flex items-center justify-between">
        <div><p className="text-indigo-200 text-xs uppercase tracking-widest font-semibold">{selectedCompany?.companyName}</p><h2 className="text-white font-bold text-xl mt-0.5">{selectedDrive?.driveName}</h2><p className="text-indigo-200 text-sm mt-0.5">{selectedDrive?.jobRole} · {selectedDrive?.packageOffered} LPA</p></div>
        <div className="text-right"><p className="text-indigo-200 text-xs">Max Rounds</p><p className="text-white text-3xl font-bold">{selectedDrive?.maxRounds}</p><p className="text-indigo-200 text-xs">{rounds.length} published</p></div>
      </div>
      {dataLoading ? <div className="flex items-center justify-center py-12"><Spinner /></div>
        : !rounds.length ? <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200"><p className="text-gray-500 font-medium text-sm">No rounds published yet</p><p className="text-gray-400 text-xs mt-1">The company will publish rounds from their dashboard.</p></div>
        : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rounds.map(r => (
            <div key={r.id || r.roundNumber} onClick={() => loadApplicants(r)} className="bg-white rounded-2xl border border-gray-200 p-5 cursor-pointer hover:border-indigo-400 hover:shadow-md transition group">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">{r.roundNumber}</div>
                <div className="flex-1"><p className="font-bold text-gray-800">{r.roundName}</p><p className="text-xs text-gray-400">{r.roundDate}</p></div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 mt-1 transition" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
              </div>
              {r.roundLink && <a href={r.roundLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-indigo-500 hover:underline flex items-center gap-1 mb-2">Round Link</a>}
              <p className="text-xs text-indigo-600 font-medium mt-2">Click to view applicants →</p>
            </div>
          ))}
        </div>
      }
    </div>
  )

  const renderApplicants = () => (
    <div>
      <Breadcrumb items={[{ label: 'Companies', onClick: goCompanies }, { label: selectedCompany?.companyName, onClick: goDrives }, { label: selectedDrive?.driveName, onClick: goRounds }, { label: `Round ${selectedRound?.roundNumber} — ${selectedRound?.roundName}` }]} />
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[['Total', applicants.length, 'text-gray-700'], ['Pending', applicants.filter(r => r.status === 'PENDING').length, 'text-blue-600'], ['Cleared', applicants.filter(r => r.status === 'CLEARED').length, 'text-emerald-600'], ['Failed', applicants.filter(r => r.status === 'FAILED').length, 'text-red-500']].map(([l, v, cls]) => (
          <div key={l} className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center"><p className={`text-xl font-bold ${cls}`}>{v}</p><p className="text-xs text-gray-400 mt-0.5">{l}</p></div>
        ))}
      </div>
      {dataLoading ? <div className="flex items-center justify-center py-12"><Spinner /></div>
        : !applicants.length ? <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 text-gray-400 text-sm">No applicants in this round yet.</div>
        : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gradient-to-r from-indigo-50 to-white text-xs text-gray-500 font-semibold uppercase tracking-wide">{['#', 'Student', 'Dept', 'CGPA', 'Mobile', 'Email', 'Score', 'Feedback', 'Status', 'Resume', 'Profile'].map(h => <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>
                {applicants.map((r, i) => (
                  <tr key={r.applicationId ?? i} className={`border-t border-gray-100 hover:bg-gray-50 transition ${r.status === 'FAILED' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 text-xs text-gray-400">{applicantsPage * 15 + i + 1}</td>
                    <td className="px-4 py-3"><p className="font-semibold text-gray-800 text-sm">{r.studentName || '—'}</p><p className="text-xs text-gray-400 font-mono">{r.studentRollNo}</p></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{r.department || '—'}</td>
                    <td className="px-4 py-3">{r.currentCgpa != null ? <span className={`font-bold text-sm ${r.currentCgpa >= 8 ? 'text-emerald-600' : r.currentCgpa >= 7 ? 'text-amber-600' : 'text-red-500'}`}>{r.currentCgpa}</span> : <span className="text-gray-300 text-xs">—</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.mobileNo || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{r.email || '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-indigo-600">{r.score ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[120px] truncate">{r.feedback || '—'}</td>
                    <td className="px-4 py-3"><Badge status={r.status} /></td>
                    <td className="px-4 py-3">
                      {r.resume ? (
                        <div className="flex gap-1">
                          <button onClick={() => { setResumeUrl(r.resume); setResumeMeta({ name: r.studentName, rollNo: r.studentRollNo }) }} className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 font-medium border border-indigo-200">View</button>
                          <button onClick={() => downloadPdf(r.resume, `${r.studentRollNo}_resume.pdf`)} className="px-2 py-1 text-xs bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 font-medium border border-emerald-200">Save</button>
                        </div>
                      ) : <span className="text-xs text-gray-300 italic">None</span>}
                    </td>
                    <td className="px-4 py-3"><button onClick={() => openStudentProfile(r)} className="flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-50 text-gray-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 font-medium transition">Profile</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applicantsTotalPg > 1 && (
              <div className="px-4 py-4 border-t border-gray-100 flex justify-center">
                <Pagination page={applicantsPage} totalPages={applicantsTotalPg} onPage={loadApplicantsPage} />
              </div>
            )}
          </div>
        )}
    </div>
  )

  return (
    <DashboardLayout>
      <div className="p-8">
        {view === 'companies'  && renderCompanies()}
        {view === 'drives'     && renderDrives()}
        {view === 'rounds'     && renderRounds()}
        {view === 'applicants' && renderApplicants()}
      </div>

      {/* Register Company Modal */}
      {showCoForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowCoForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">Register Company</h3></div>
            <div className="p-6 space-y-4">
              {[['Company ID', 'companyId', 'text', 'e.g. C005 (unique)'], ['Company Name', 'companyName', 'text', 'e.g. Wipro Technologies'], ['Official Email', 'email', 'email', 'campus@wipro.com'], ['Website', 'website', 'text', 'https://wipro.com'], ['Industry Type', 'industryType', 'text', 'IT Services / Consulting'], ['Description', 'description', 'text', 'Short description']].map(([l, k, t, ph]) => (
                <Input key={k} label={l} type={t} placeholder={ph} value={coFrm[k]} onChange={e => setCoFrm(p => ({ ...p, [k]: e.target.value }))} />
              ))}
              <Input label="Password" placeholder="min 8 characters" showEye value={coFrm.password} onChange={e => setCoFrm(p => ({ ...p, password: e.target.value }))} hint="Min 8 characters" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCoForm(false)} className="flex-1 h-10 border border-gray-300 rounded-full text-sm text-gray-600">Cancel</button>
                <button onClick={handleRegisterCompany} disabled={coSaving} className="flex-1 h-10 bg-indigo-600 rounded-full text-sm text-white hover:bg-indigo-700 disabled:opacity-60">{coSaving ? 'Registering...' : 'Register'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Modal */}
      {eligModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEligModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">Set Eligibility — {eligModal}</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Min CGPA" type="number" inputMode="decimal" placeholder="e.g. 7.0" hint="0.0 – 10.0" value={eligFrm.minimumCgpa} onChange={e => setEligFrm(p => ({ ...p, minimumCgpa: e.target.value }))} />
                <Input label="Max Backlogs" type="number" inputMode="numeric" placeholder="e.g. 0" hint="0 = none allowed" value={eligFrm.maxActiveBacklogs} onChange={e => setEligFrm(p => ({ ...p, maxActiveBacklogs: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Allowed Branches</label>
                <div className="flex flex-wrap gap-1.5">{BRANCHES.map(b => { const sel = eligFrm.allowedBranch.split(',').map(x => x.trim()).includes(b); return <button key={b} onClick={() => toggleBranch(b)} className={`text-xs px-2.5 py-1 rounded-full border transition font-medium ${sel ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>{b}</button> })}</div>
                <p className="text-xs text-gray-400 mt-1">Selected: {eligFrm.allowedBranch}</p>
              </div>
              <Input label="Passing Year" type="number" inputMode="numeric" placeholder="e.g. 2025" value={eligFrm.passingYear} onChange={e => setEligFrm(p => ({ ...p, passingYear: e.target.value }))} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <div className="relative border border-gray-300 rounded-full bg-white focus-within:ring-2 focus-within:ring-indigo-400 overflow-hidden">
                  <select value={eligFrm.gender} onChange={e => setEligFrm(p => ({ ...p, gender: e.target.value }))} className="w-full h-10 px-4 pr-8 text-sm text-gray-800 bg-transparent outline-none appearance-none cursor-pointer"><option value="BOTH">BOTH</option><option value="MALE">MALE only</option><option value="FEMALE">FEMALE only</option></select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer" onClick={() => setEligFrm(p => ({ ...p, hasHistoryBacklogs: !p.hasHistoryBacklogs }))}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${eligFrm.hasHistoryBacklogs ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>{eligFrm.hasHistoryBacklogs && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="m10.092.952-.005-.006-.006-.005A.45.45 0 0 0 9.43.939L4.162 6.23 1.585 3.636a.45.45 0 0 0-.652 0 .47.47 0 0 0 0 .657l.002.002L3.58 6.958a.8.8 0 0 0 .567.242.78.78 0 0 0 .567-.242l5.333-5.356a.474.474 0 0 0 .044-.65Z" fill="white" stroke="white" strokeWidth=".4"/></svg>}</div>
                <span className="text-sm text-gray-700 select-none">Allow students with backlog history</span>
              </label>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">⚠ After saving, click <strong>Publish</strong> on the drive to push it to eligible students.</div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEligModal(null)} className="flex-1 h-10 border border-gray-300 rounded-full text-sm text-gray-600">Cancel</button>
                <button onClick={handleSaveEligibility} disabled={eligSaving} className="flex-1 h-10 bg-indigo-600 rounded-full text-sm text-white hover:bg-indigo-700 disabled:opacity-60">{eligSaving ? 'Saving...' : 'Save Eligibility'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {viewStudent && <StudentProfileModal student={viewStudent.student} profile={viewStudent.profile} loading={profileLoading} onClose={() => setViewStudent(null)} onViewResume={(url) => { setResumeUrl(url); setResumeMeta({ name: viewStudent.student.name + ' ' + viewStudent.student.surname, rollNo: viewStudent.student.rollNo }) }} />}

      {/* Resume Preview Modal */}
      {resumeUrl && <ResumePreviewModal url={resumeUrl} studentName={resumeMeta?.name} rollNo={resumeMeta?.rollNo} onClose={() => { setResumeUrl(null); setResumeMeta(null) }} />}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm flex items-center gap-2.5 shadow-xl z-50">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
          {toast}
        </div>
      )}
    </DashboardLayout>
  )
}
