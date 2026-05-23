import { useState, useCallback, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { adminApi } from '../../api/services'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../../components/ui/Pagination'

// ── PDF Preview Modal ─────────────────────────────────────────────
function ResumePreviewModal({ student, onClose }) {
  const filename = `${student?.rollNo || 'resume'}.pdf`
  const [blobUrl, setBlobUrl] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!student?.rollNo) return
    let url = null
    let isMounted = true
    setLoadError(false)
    setBlobUrl(null)

    adminApi.viewStudentResume(student.rollNo)
      .then(res => {
        if (!isMounted) return
        const fileData = res.data?.data || res.data
        if (!fileData) { setLoadError(true); return }
        url = URL.createObjectURL(new Blob([fileData], { type: 'application/pdf' }))
        setBlobUrl(url)
      })
      .catch(() => { if (isMounted) setLoadError(true) })

    return () => { isMounted = false; if (url) URL.revokeObjectURL(url) }
  }, [student?.rollNo])

  const handleDownload = () => {
    if (!blobUrl) return
    const a = document.createElement('a')
    a.href = blobUrl; a.download = filename
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">{(student?.name || '?')[0]}</div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{student?.name} {student?.surname}</p>
              <p className="text-xs text-gray-400 font-mono">{student?.rollNo} · Resume Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {blobUrl && <button onClick={handleDownload} className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-600 rounded-full">Download</button>}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">✕</button>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-gray-50/30 relative">
          {!blobUrl && !loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <svg className="w-8 h-8 animate-spin text-indigo-500 mb-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
              <p className="text-gray-500 font-medium">Loading resume...</p>
            </div>
          ) : loadError ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500"><p>Failed to load resume</p></div>
          ) : (
            <iframe src={`${blobUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`} className="w-full h-full border-none" title="Resume" />
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminStudents() {
  const [search, setSearch]         = useState('')
  const [viewStudent, setViewStudent] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profile, setProfile]       = useState(null)
  const [resumeModal, setResumeModal] = useState(null)

  const fetchFn = useCallback((page, size) => adminApi.getAllStudents(page, size), [])
  const { items: students, loading, error, page, totalPages, totalElements, goToPage } =
    usePagination(fetchFn,15)

  const filtered = search.trim()
    ? students.filter(s =>
        (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.rollNo || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(search.toLowerCase())
      )
    : students

  const openProfile = async (s) => {
    setViewStudent(s); setProfile(null); setProfileLoading(true)
    try {
      const res = await adminApi.getStudentProfile(s.rollNo)
      setProfile(res.data?.data ?? res.data)
    } catch { setProfile(null) }
    finally { setProfileLoading(false) }
  }

  const openResume = (student) => { setViewStudent(null); setResumeModal({ student }) }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-800 font-semibold text-lg">All Students</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {totalElements != null ? `${totalElements} total students` : 'Loading…'}
              {search.trim() && ` · ${filtered.length} matching "${search}"`}
            </p>
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 bg-white w-64">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, roll no..."
              className="text-sm outline-none bg-transparent w-full text-gray-700 placeholder-gray-400" />
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="w-7 h-7 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-white text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  {['Roll No', 'Name', 'Email', 'Mobile', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.rollNo || i} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.rollNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{s.name} {s.surname}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{s.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.mobileNo}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => openProfile(s)}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 font-medium transition">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                      {search.trim() ? `No students matching "${search}".` : 'No students found.'}
                    </td>
                  </tr>
                )}
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

      {/* Profile Modal */}
      {viewStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setViewStudent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">{(viewStudent.name || '?')[0]}</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{viewStudent.name} {viewStudent.surname}</p>
                  <p className="text-xs text-gray-400 font-mono">{viewStudent.rollNo}</p>
                </div>
              </div>
              <button onClick={() => setViewStudent(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              {profileLoading ? (
                <div className="flex items-center justify-center py-10">
                  <svg className="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                </div>
              ) : !profile ? (
                <p className="text-center text-gray-400 text-sm py-8">Profile not uploaded yet.</p>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Department', profile.department],
                      ['Gender', profile.gender],
                      ['CGPA', profile.currentCgpa],
                      ['Semester', profile.currentSemester],
                      ['10th %', profile.tenthPercentage != null ? profile.tenthPercentage + '%' : '—'],
                      ['12th %', profile.twelthPercentage != null ? profile.twelthPercentage + '%' : '—'],
                      ['Active Backlogs', profile.backlogCount],
                      ['Passing Year', profile.passingYear],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">{l}</p>
                        <p className="font-semibold text-sm text-gray-800 mt-0.5">{v ?? '—'}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${profile.hasBacklogHistory ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {profile.hasBacklogHistory ? '⚠ Has backlog history' : '✓ No backlog history'}
                    </div>
                    {profile.resumeUrl && (
                      <button onClick={() => openResume(viewStudent)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Preview Resume
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {resumeModal && (
        <ResumePreviewModal student={resumeModal.student} onClose={() => setResumeModal(null)} />
      )}
    </DashboardLayout>
  )
}
