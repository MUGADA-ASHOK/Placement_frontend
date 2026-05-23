import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useFetch } from '../../hooks/useFetch'
import { companyApi } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

export default function CompanyDashboard() {
  const { user } = useAuth()

  // Use dedicated count endpoints — avoids loading the full drive list just for a number
  const { data: totalDrives } = useFetch(companyApi.countDrives)
  const { data: activeDrives } = useFetch(companyApi.countActiveDrives)

  const countDisplay = (v) =>
    v == null
      ? <span className="w-10 h-7 bg-gray-100 rounded animate-pulse inline-block" />
      : v

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-2xl px-7 py-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute right-16 -bottom-12 w-56 h-56 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <p className="text-emerald-200 text-xs font-semibold uppercase tracking-widest">Company Dashboard</p>
            <h2 className="text-white text-xl font-bold mt-0.5">{user?.email?.split('@')[0] || 'Company'}</h2>
            <p className="text-emerald-200 text-sm mt-1">Campus Recruitment · ANITS Placement Cell</p>
          </div>
          <div className="relative z-10 hidden md:flex items-center gap-6">
            {[
              ['Total Drives', totalDrives, 'text-white'],
              ['Active Drives', activeDrives, 'text-emerald-300'],
            ].map(([l, v, c]) => (
              <div key={l} className="text-center">
                <p className={`text-2xl font-bold ${c}`}>{countDisplay(v)}</p>
                <p className="text-emerald-200 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Drives</p>
              <p className="text-2xl font-semibold text-gray-800">{countDisplay(totalDrives)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Active Drives</p>
              <p className="text-2xl font-semibold text-gray-800">{countDisplay(activeDrives)}</p>
            </div>
          </div>
        </div>

        <Link to="/company/drives"
          className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-emerald-200 transition group">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-2xl group-hover:bg-emerald-100 transition">📋</div>
          <div>
            <h3 className="font-semibold text-gray-800">Manage My Drives</h3>
            <p className="text-sm text-gray-400 mt-0.5">View applicants, publish rounds, score candidates, and filter top talent.</p>
          </div>
          <svg className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
        </Link>
      </div>
    </DashboardLayout>
  )
}