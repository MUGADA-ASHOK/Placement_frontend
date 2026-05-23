import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { studentApi } from '../../api/services'

const DEPT_OPTIONS = ['CSE','ECE','EEE','CHEM','IT','CSM','CSD','MECH','CIVIL']
const GENDER_OPTIONS = [{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHERS', label: 'Others' }]

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 block mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-indigo-400 mt-1 pl-1 italic">{hint}</p>}
    </div>
  )
}

function PillInput({ ...props }) {
  return (
    <div className="flex items-center border border-indigo-100 rounded-xl px-4 h-10 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 overflow-hidden bg-indigo-50 transition-colors">
      <input className="w-full outline-none text-sm bg-transparent text-gray-800 placeholder-indigo-300" {...props} />
    </div>
  )
}

function PillSelect({ value, onChange, options }) {
  return (
    <div className="relative border border-indigo-100 rounded-xl px-4 h-10 focus-within:ring-2 focus-within:ring-indigo-400 overflow-hidden flex items-center bg-indigo-50 transition-colors">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full outline-none text-sm text-gray-800 bg-transparent appearance-none cursor-pointer pr-5">
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
      <svg className="absolute right-3 pointer-events-none text-indigo-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  )
}

// ── PDF Preview Modal ──────────────────────────────────────────────
function ResumePDFModal({ resumeUrl, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null)

  useEffect(() => {
    if (!resumeUrl) return
    let active = true
    fetch(resumeUrl)
      .then(res => res.arrayBuffer())
      .then(buf => {
        if (!active) return
        setBlobUrl(URL.createObjectURL(new Blob([buf], { type: 'application/pdf' })))
      })
      .catch(() => {
        if (active) setBlobUrl(resumeUrl)
      })
    return () => { active = false }
  }, [resumeUrl])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">My Resume</p>
              <p className="text-xs text-gray-400">Preview only — upload a new file below to replace</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-hidden rounded-b-2xl" style={{ minHeight: '540px' }}>
          {blobUrl ? (
            <iframe
              src={`${blobUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full"
              style={{ minHeight: '540px', border: 'none' }}
              title="My Resume"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[540px]">
              <svg className="w-8 h-8 animate-spin text-indigo-500 mb-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
              <p className="text-gray-500 font-medium">Loading resume preview...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [toast, setToast] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showPDF, setShowPDF] = useState(false)

  const blank = { department: 'CSE', tenthPercentage: '', twelthPercentage: '', diplomaPercentage: '', currentCgpa: '', currentSemester: '', backlogCount: '', hasBacklogHistory: false, passingYear: '', gender: 'MALE' }
  const [form, setForm] = useState(blank)

  const showToast = m => { setToast(m); setTimeout(() => setToast(null), 3000) }

  const fetchProfile = () => {
    studentApi.getProfile()
      .then(res => {
        const p = res.data?.data ?? res.data
        if (p) { setProfile(p); setForm({ ...blank, ...p, diplomaPercentage: p.diplomaPercentage ?? '' }); setIsNew(false) }
        else setIsNew(true)
      })
      .catch(() => setIsNew(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProfile() }, [])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, tenthPercentage: Number(form.tenthPercentage), twelthPercentage: Number(form.twelthPercentage), currentCgpa: Number(form.currentCgpa), currentSemester: Number(form.currentSemester), backlogCount: Number(form.backlogCount), passingYear: Number(form.passingYear), diplomaPercentage: form.diplomaPercentage ? Number(form.diplomaPercentage) : null }
      if (isNew) await studentApi.addProfile(payload)
      else await studentApi.updateProfile(payload)
      setIsNew(false)
      showToast('Profile saved successfully!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save profile')
    } finally { setSaving(false) }
  }

  const handleResumeUpload = async () => {
    if (!resumeFile) return
    if (resumeFile.type !== 'application/pdf') { showToast('Please upload a PDF file'); return }
    if (resumeFile.size > 5 * 1024 * 1024) { showToast('File size must be under 5MB'); return }
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', resumeFile)
      await studentApi.uploadResume(fd)
      showToast('Resume uploaded successfully!')
      setResumeFile(null)
      // Re-fetch profile so resumeUrl is updated and preview button appears
      setLoading(true)
      fetchProfile()
    } catch (err) { showToast(err.response?.data?.message || 'Upload failed') }
    finally { setUploading(false) }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-20">
        <svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="p-8 max-w-2xl space-y-5">
        <div>
          <h2 className="text-gray-800 font-semibold text-lg">My Profile</h2>
          <p className="text-gray-400 text-sm mt-0.5">{isNew ? 'Create your academic profile to become eligible for placement drives.' : 'Update your academic details.'}</p>
        </div>

        {isNew && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Profile not created yet. Fill in all fields and save to start applying for drives.
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <Field label="Department" hint="CSE | ECE | IT | CSM | CSD | EEE | MECH | CIVIL | CHEM">
            <PillSelect value={form.department} onChange={v => set('department', v)} options={DEPT_OPTIONS.map(d => ({ value: d, label: d }))} />
          </Field>
          <Field label="Gender" hint="MALE | FEMALE | OTHERS">
            <PillSelect value={form.gender} onChange={v => set('gender', v)} options={GENDER_OPTIONS} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="10th Percentage" hint="44.0 – 100.0">
              <PillInput type="number" value={form.tenthPercentage} onChange={e => set('tenthPercentage', e.target.value)} placeholder="e.g. 85.5" />
            </Field>
            <Field label="12th Percentage" hint="44.0 – 100.0">
              <PillInput type="number" value={form.twelthPercentage} onChange={e => set('twelthPercentage', e.target.value)} placeholder="e.g. 87.0" />
            </Field>
          </div>
          <Field label="Diploma % (optional)" hint="Leave blank if not applicable">
            <PillInput type="number" value={form.diplomaPercentage} onChange={e => set('diplomaPercentage', e.target.value)} placeholder="e.g. 75.0" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current CGPA" hint="4.0 – 10.0">
              <PillInput type="number" value={form.currentCgpa} onChange={e => set('currentCgpa', e.target.value)} placeholder="e.g. 8.5" />
            </Field>
            <Field label="Current Semester" hint="1 – 8">
              <PillInput type="number" value={form.currentSemester} onChange={e => set('currentSemester', e.target.value)} placeholder="e.g. 8" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Active Backlogs" hint="0 – 55">
              <PillInput type="number" value={form.backlogCount} onChange={e => set('backlogCount', e.target.value)} placeholder="e.g. 0" />
            </Field>
            <Field label="Passing Year" hint="e.g. 2025">
              <PillInput type="number" value={form.passingYear} onChange={e => set('passingYear', e.target.value)} placeholder="e.g. 2025" />
            </Field>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="hidden peer" checked={form.hasBacklogHistory} onChange={e => set('hasBacklogHistory', e.target.checked)} />
            <span className="w-5 h-5 border border-gray-300 rounded relative flex items-center justify-center peer-checked:border-indigo-600 peer-checked:bg-indigo-600 shrink-0">
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="m10.092.952-.005-.006-.006-.005A.45.45 0 0 0 9.43.939L4.162 6.23 1.585 3.636a.45.45 0 0 0-.652 0 .47.47 0 0 0 0 .657l.002.002L3.58 6.958a.8.8 0 0 0 .567.242.78.78 0 0 0 .567-.242l5.333-5.356a.474.474 0 0 0 .044-.65Z" fill="#F5F7FF" stroke="#F5F7FF" strokeWidth=".4"/></svg>
            </span>
            <span className="text-sm text-gray-700 select-none">Has backlog history (ever had a backlog)</span>
          </label>

          <button onClick={handleSave} disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition disabled:opacity-60">
            {saving ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Saving...</> : `${isNew ? 'Create' : 'Update'} Profile`}
          </button>
        </div>

        {/* ── Resume section ───────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">Resume</h3>
          <p className="text-xs text-gray-400 mb-4">PDF only · Max 5 MB · Upload to replace your current resume</p>

          {/* Preview strip — visible only if resume already uploaded */}
          {profile?.resumeUrl && (
            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-4">
              <svg className="w-8 h-8 text-indigo-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">Resume uploaded</p>
                <p className="text-xs text-gray-400 truncate">{profile.resumeUrl.split('/').pop()}</p>
              </div>
              <button
                onClick={() => setShowPDF(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-full hover:bg-indigo-700 transition shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Preview PDF
              </button>
            </div>
          )}

          {/* Upload dropzone */}
          <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <p className="text-gray-600 text-sm font-medium">
              {resumeFile ? resumeFile.name : profile?.resumeUrl ? 'Select a new PDF to replace current resume' : 'Select your resume PDF'}
            </p>
            <p className="text-gray-400 text-xs mt-1">PDF only · Max 5MB</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <label className="px-4 py-2 text-xs bg-indigo-50 text-indigo-600 rounded-full cursor-pointer hover:bg-indigo-100 font-medium transition">
                Browse Files
                <input type="file" accept=".pdf" className="hidden" onChange={e => setResumeFile(e.target.files[0])} />
              </label>
              {resumeFile && (
                <button onClick={handleResumeUpload} disabled={uploading}
                  className="px-4 py-2 text-xs bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-medium transition disabled:opacity-60">
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm flex items-center gap-2.5 shadow-xl z-50">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
          {toast}
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPDF && profile?.resumeUrl && (
        <ResumePDFModal resumeUrl={profile.resumeUrl} onClose={() => setShowPDF(false)} />
      )}
    </DashboardLayout>
  )
}
