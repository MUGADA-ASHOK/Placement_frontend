import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../../components/ui/Pagination'
import { adminApi } from '../../api/services'

// ── Shared mini-components ───────────────────────────────────────
function Input({ label, hint, error, showEye, ...props }) {
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

function Select({ label, error, options = [], ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
      <div className={`relative border rounded-full bg-white focus-within:ring-2 focus-within:ring-indigo-400 overflow-hidden transition ${error ? 'border-red-400' : 'border-gray-300'}`}>
        <select className="w-full h-10 px-4 pr-8 text-sm text-gray-800 bg-transparent outline-none appearance-none cursor-pointer" {...props}>
          <option value="">— Select —</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </div>
      {error && <p className="text-xs text-red-600 pl-1">{error}</p>}
    </div>
  )
}

function Btn({ children, color = 'indigo', loading, disabled, onClick }) {
  const cls = { indigo: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200', green: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200', red: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200', gray: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200', amber: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200', violet: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200' }
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition active:scale-95 disabled:opacity-50 ${cls[color]}`}>
      {loading && <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
      {children}
    </button>
  )
}

function PublishAndEligibilityButtons({ drive, handleAction, actionLoading, openElig }) {
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    adminApi.isDrivePublished(drive.driveId)
      .then(res => setIsPublished(res.data?.data ?? res.data))
      .catch(() => setIsPublished(false))
      .finally(() => setLoading(false))
  }, [drive.driveId, actionLoading])
  if (loading) return <><Btn color="gray" loading>Checking</Btn><Btn color="gray" loading>Checking</Btn></>
  return (
    <>
      {isPublished
        ? <Btn color="green" disabled>Published</Btn>
        : <Btn color="red" loading={actionLoading === 'publish' + drive.driveId} onClick={e => handleAction('publish', drive, e)}>Publish</Btn>
      }
      {isPublished
        ? <Btn color="violet" onClick={e => openElig(drive, e)}>Update Eligibility</Btn>
        : <Btn color="gray" onClick={e => openElig(drive, e)}>Set Eligibility</Btn>
      }
    </>
  )
}

const BRANCHES = 'CSE,ECE,EEE,CHEM,IT,CSM,CSD,MECH,CIVIL'.split(',')
const driveInit = { driveId: '', companyId: '', driveName: '', jobRole: '', packageOffered: '', jobLocation: '', vacancies: '', registrationStartDate: '', registrationEndDate: '', maxRounds: '', description: '', externalLink: '' }
const eligInit  = { driveId: '', minimumCgpa: '', maxActiveBacklogs: '', allowedBranch: 'CSE', passingYear: '', gender: 'BOTH', hasHistoryBacklogs: false }

export default function AdminDrives() {
  const fetchFn = useCallback((page, size) => adminApi.getAllActiveDrives(page, size), [])
  const { items: drives, loading, error, page, totalPages, totalElements, goToPage, refetch } =
    usePagination(fetchFn, 15)

  const [modal, setModal]               = useState('')
  const [selectedDrive, setSelectedDrive] = useState(null)
  const [applications, setApplications]   = useState(null)
  const [appsLoading, setAppsLoading]     = useState(false)
  const [extDate, setExtDate]             = useState('')
  const [toast, setToast]                 = useState(null)
  const [actionLoading, setActionLoading] = useState('')
  const [driveForm, setDriveForm]         = useState(driveInit)
  const [eligForm, setEligForm]           = useState(eligInit)

  const showToast = m => { setToast(m); setTimeout(() => setToast(null), 3500) }

  const handleAction = async (action, drive, e) => {
    e?.stopPropagation()
    setActionLoading(action + drive.driveId)
    try {
      if (action === 'publish') await adminApi.publishDrive(drive.driveId)
      else if (action === 'close')  await adminApi.closeDrive(drive.driveId)
      else if (action === 'delete') await adminApi.deleteDrive(drive.driveId)
      showToast(`Drive ${action}d successfully!`)
      refetch()
    } catch (err) { showToast(err.response?.data?.message || `Failed to ${action}`) }
    finally { setActionLoading('') }
  }

  const handleCreateDrive = async () => {
    if (!driveForm.driveId || !driveForm.companyId || !driveForm.driveName || !driveForm.jobRole) {
      showToast('Drive ID, Company ID, Drive Name and Job Role are required'); return
    }
    setActionLoading('drive')
    try {
      await adminApi.addDrive({ ...driveForm, packageOffered: Number(driveForm.packageOffered), vacancies: Number(driveForm.vacancies), maxRounds: Number(driveForm.maxRounds) })
      showToast('Drive created successfully!')
      setDriveForm(driveInit); setModal(''); refetch()
    } catch (err) { showToast(err.response?.data?.message || 'Failed to create drive') }
    finally { setActionLoading('') }
  }

  const handleCreateElig = async () => {
    if (!eligForm.driveId || eligForm.minimumCgpa === '' || eligForm.passingYear === '') {
      showToast('Drive ID, Minimum CGPA, and Passing Year are required'); return
    }
    setActionLoading('elig')
    try {
      const payload = { id: eligForm.id || null, driveId: eligForm.driveId, minimumCgpa: Number(eligForm.minimumCgpa), maxActiveBacklogs: Number(eligForm.maxActiveBacklogs || 0), allowedBranch: eligForm.allowedBranch, passingYear: Number(eligForm.passingYear), gender: eligForm.gender, hasHistoryBacklogs: Boolean(eligForm.hasHistoryBacklogs) }
      if (eligForm.id) { await adminApi.updateEligibility(eligForm.driveId, payload); showToast('Eligibility updated successfully!') }
      else { await adminApi.addEligibility(payload); showToast('Eligibility set successfully!') }
      setEligForm(eligInit); setModal(''); refetch()
    } catch (err) { showToast(err.response?.data?.message || 'Failed to set eligibility') }
    finally { setActionLoading('') }
  }

  const openApps = async (drive, e) => {
    e?.stopPropagation(); setSelectedDrive(drive); setModal('apps'); setAppsLoading(true)
    try {
      const res = await adminApi.getApplications(drive.driveId)
      const body = res.data?.data ?? res.data
      setApplications(body?.content ?? (Array.isArray(body) ? body : []))
    } catch { setApplications([]) }
    finally { setAppsLoading(false) }
  }

  const handleExtend = async () => {
    if (!extDate) { showToast('Pick a new end date'); return }
    setActionLoading('extend')
    try { await adminApi.extendDrive(selectedDrive.driveId, extDate); showToast('Drive deadline extended!'); setModal(''); refetch() }
    catch (err) { showToast(err.response?.data?.message || 'Failed to extend') }
    finally { setActionLoading('') }
  }

  const toggleBranch = b => setEligForm(p => {
    const cur = p.allowedBranch.split(',').map(x => x.trim()).filter(Boolean)
    return { ...p, allowedBranch: (cur.includes(b) ? cur.filter(x => x !== b) : [...cur, b]).join(',') }
  })

  const openElig = (drive, e) => {
    e?.stopPropagation()
    setSelectedDrive(drive)
    setEligForm(drive.eligibility ? { ...drive.eligibility, driveId: drive.driveId } : { ...eligInit, driveId: drive.driveId })
    setModal('elig')
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-800 font-semibold text-lg">Active Drives</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {totalElements != null ? `${totalElements} drives total` : 'Loading…'} · Create drive → add eligibility → publish to students
            </p>
          </div>
          <button onClick={() => { setDriveForm(driveInit); setModal('drive') }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Drive
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="w-7 h-7 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-white text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  {['Company / Drive', 'Role', 'Package', 'Location', 'End Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drives.map(d => (
                  <tr key={d.driveId} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                          {(d.companyId || 'CO').slice(-2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{d.driveName}</p>
                          <p className="text-gray-400 text-xs font-mono">{d.companyId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{d.jobRole}</td>
                    <td className="px-4 py-3"><span className="font-semibold text-emerald-600 text-xs">{d.packageOffered} LPA</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{d.jobLocation}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{d.registrationEndDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${d.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {d.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        <Btn color="indigo" onClick={e => openApps(d, e)}>Apps</Btn>
                        <PublishAndEligibilityButtons drive={d} handleAction={handleAction} actionLoading={actionLoading} openElig={openElig} />
                        <Btn color="amber" loading={actionLoading === 'close' + d.driveId} onClick={e => handleAction('close', d, e)}>Close</Btn>
                        <Btn color="gray" onClick={e => { e.stopPropagation(); setSelectedDrive(d); setExtDate(''); setModal('extend') }}>Extend</Btn>
                        <Btn color="red" loading={actionLoading === 'delete' + d.driveId} onClick={e => handleAction('delete', d, e)}>Delete</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
                {drives.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No drives found.</td></tr>
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

      {/* Add Drive Modal */}
      {modal === 'drive' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModal('')}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="font-semibold text-gray-800">Add Drive</h3>
              <p className="text-xs text-gray-400 mt-0.5">POST /api/admin/company/addDrive · DriveDto</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Drive ID" value={driveForm.driveId} onChange={e => setDriveForm(p => ({ ...p, driveId: e.target.value }))} placeholder="e.g. DRV005" />
                <Input label="Company ID" value={driveForm.companyId} onChange={e => setDriveForm(p => ({ ...p, companyId: e.target.value }))} placeholder="e.g. C001" />
              </div>
              <Input label="Drive Name" value={driveForm.driveName} onChange={e => setDriveForm(p => ({ ...p, driveName: e.target.value }))} placeholder="e.g. SDE Recruitment 2025" />
              <Input label="Job Role" value={driveForm.jobRole} onChange={e => setDriveForm(p => ({ ...p, jobRole: e.target.value }))} placeholder="e.g. Software Development Engineer" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Package (LPA)" type="number" value={driveForm.packageOffered} onChange={e => setDriveForm(p => ({ ...p, packageOffered: e.target.value }))} placeholder="12.5" />
                <Input label="Job Location" value={driveForm.jobLocation} onChange={e => setDriveForm(p => ({ ...p, jobLocation: e.target.value }))} placeholder="Hyderabad" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Vacancies" type="number" inputMode="numeric" value={driveForm.vacancies} onChange={e => setDriveForm(p => ({ ...p, vacancies: e.target.value }))} placeholder="50" hint="Integer (e.g. 50)" />
                <Input label="Max Rounds" type="number" inputMode="numeric" value={driveForm.maxRounds} onChange={e => setDriveForm(p => ({ ...p, maxRounds: e.target.value }))} placeholder="3" hint="Integer (e.g. 3)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Reg Start Date" type="date" value={driveForm.registrationStartDate} onChange={e => setDriveForm(p => ({ ...p, registrationStartDate: e.target.value }))} />
                <Input label="Reg End Date" type="date" value={driveForm.registrationEndDate} onChange={e => setDriveForm(p => ({ ...p, registrationEndDate: e.target.value }))} />
              </div>
              <Input label="Description" value={driveForm.description} onChange={e => setDriveForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description..." />
              <Input label="External Link (optional)" value={driveForm.externalLink} onChange={e => setDriveForm(p => ({ ...p, externalLink: e.target.value }))} placeholder="https://..." />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal('')} className="flex-1 h-10 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleCreateDrive} disabled={actionLoading === 'drive'} className="flex-1 h-10 bg-indigo-600 rounded-full text-sm text-white hover:bg-indigo-700 disabled:opacity-60">
                  {actionLoading === 'drive' ? 'Creating...' : 'Create Drive'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Modal */}
      {modal === 'elig' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModal('')}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="font-semibold text-gray-800">{eligForm.id ? 'Update' : 'Set'} Eligibility — {eligForm.driveId}</h3>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Drive ID (auto-filled)" value={eligForm.driveId} readOnly onChange={() => {}} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Minimum CGPA" type="number" inputMode="decimal" value={eligForm.minimumCgpa} onChange={e => setEligForm(p => ({ ...p, minimumCgpa: e.target.value }))} placeholder="e.g. 7.0" hint="0.0 – 10.0" />
                <Input label="Max Active Backlogs" type="number" inputMode="numeric" value={eligForm.maxActiveBacklogs} onChange={e => setEligForm(p => ({ ...p, maxActiveBacklogs: e.target.value }))} placeholder="e.g. 0" hint="0 – 55" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Allowed Branches</label>
                <div className="flex flex-wrap gap-1.5">
                  {BRANCHES.map(b => {
                    const selected = eligForm.allowedBranch.split(',').map(x => x.trim()).includes(b)
                    return <button key={b} onClick={() => toggleBranch(b)} className={`text-xs px-2.5 py-1 rounded-full border transition font-medium ${selected ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>{b}</button>
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Selected: {eligForm.allowedBranch || 'none'}</p>
              </div>
              <Input label="Passing Year" type="number" inputMode="numeric" value={eligForm.passingYear} onChange={e => setEligForm(p => ({ ...p, passingYear: e.target.value }))} placeholder="e.g. 2025" hint="4-digit year" />
              <Select label="Gender Eligibility" value={eligForm.gender} onChange={e => setEligForm(p => ({ ...p, gender: e.target.value }))}
                options={[{ value: 'BOTH', label: 'BOTH — all genders' }, { value: 'MALE', label: 'MALE only' }, { value: 'FEMALE', label: 'FEMALE only' }]} />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="hidden peer" checked={!!eligForm.hasHistoryBacklogs} onChange={e => setEligForm(p => ({ ...p, hasHistoryBacklogs: e.target.checked }))} />
                <span className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center peer-checked:border-indigo-600 peer-checked:bg-indigo-600 shrink-0">
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="m10.092.952-.005-.006-.006-.005A.45.45 0 0 0 9.43.939L4.162 6.23 1.585 3.636a.45.45 0 0 0-.652 0 .47.47 0 0 0 0 .657l.002.002L3.58 6.958a.8.8 0 0 0 .567.242.78.78 0 0 0 .567-.242l5.333-5.356a.474.474 0 0 0 .044-.65Z" fill="#F5F7FF" stroke="#F5F7FF" strokeWidth=".4"/></svg>
                </span>
                <span className="text-sm text-gray-700">Allow students with backlog history</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal('')} className="flex-1 h-10 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleCreateElig} disabled={actionLoading === 'elig'} className="flex-1 h-10 bg-indigo-600 rounded-full text-sm text-white hover:bg-indigo-700 disabled:opacity-60">
                  {actionLoading === 'elig' ? 'Saving...' : (eligForm.id ? 'Update Eligibility' : 'Save Eligibility')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications Modal */}
      {modal === 'apps' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModal('')}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div><h3 className="font-semibold text-gray-800">Applications — {selectedDrive?.driveName}</h3><p className="text-xs text-gray-400">{selectedDrive?.driveId}</p></div>
              <button onClick={() => setModal('')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6">
              {appsLoading ? (
                <div className="flex items-center justify-center py-8"><svg className="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>
              ) : !applications?.length ? (
                <p className="text-center text-gray-400 text-sm py-8">No applications yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 text-xs text-gray-500 font-semibold">
                    {['Roll No', 'Status', 'Round', 'Applied On'].map(h => <th key={h} className="px-3 py-2.5 text-left">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {applications.map((a, i) => (
                      <tr key={a.id || i} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{a.studentRollNo}</td>
                        <td className="px-3 py-2.5"><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${a.status === 'SELECTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : a.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' : a.status === 'INPROCESS' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>{a.status}</span></td>
                        <td className="px-3 py-2.5 text-xs text-gray-500">{a.currentRound > 0 ? a.currentRound : '—'}</td>
                        <td className="px-3 py-2.5 text-xs text-gray-400">{a.appliedAt || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {modal === 'extend' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal('')}>
          <div className="bg-white rounded-xl p-6 w-[360px] border border-gray-200 shadow-xl space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold text-gray-800">Extend Drive — {selectedDrive?.driveId}</h2>
            <Input label="New Registration End Date" type="date" value={extDate} onChange={e => setExtDate(e.target.value)} hint="Must be after current end date" />
            <div className="flex gap-3">
              <button onClick={() => setModal('')} className="flex-1 h-10 border border-gray-300 rounded-full text-sm text-gray-600">Cancel</button>
              <button onClick={handleExtend} disabled={actionLoading === 'extend'} className="flex-1 h-10 bg-indigo-600 rounded-full text-sm text-white hover:bg-indigo-700 disabled:opacity-60">
                {actionLoading === 'extend' ? 'Extending...' : 'Extend Drive'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm flex items-center gap-2.5 shadow-xl z-50">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
          {toast}
        </div>
      )}
    </DashboardLayout>
  )
}
