import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useFetch } from '../../hooks/useFetch'
import { studentApi } from '../../api/services'
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
          {value == null ? <span className="w-10 h-6 bg-gray-100 rounded animate-pulse inline-block" /> : value}
        </p>
      </div>
    </div>
  )
}

const STATUS_COLOR = {
  APPLIED: 'bg-indigo-400', INPROCESS: 'bg-amber-400',
  SELECTED: 'bg-emerald-500', REJECTED: 'bg-red-400',
}


export default function StudentDashboard() {
  const { user } = useAuth()

  // Profile
  const { data: profile } = useFetch(studentApi.getProfile)

  // ✅ CORRECT: Fetch counts directly from backend
  const { data: eligibleCount } = useFetch(studentApi.getEligibleDrivesCount)
  const { data: appliedCount } = useFetch(studentApi.getAppliedDrivesCount)
  const { data: selectedCount } = useFetch(studentApi.getSelectedDrivesCount)
  const { data: inProcessCount } = useFetch(studentApi.getInProcessDrivesCount)

  // Applications preview (only for timeline UI)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    studentApi.getApplications(0, 10)
      .then(res => {
        const body = res.data?.data ?? res.data
        setApplications(body?.content ?? [])
      })
      .catch(() => {})
  }, [])

  // Helper to extract value safely
  const getValue = (res) =>
    typeof res === 'number' ? res : res?.data ?? 0

  const activeApps = applications
    .filter(a => a.status !== 'ELIGIBLE')
    .slice(0, 4)

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">

        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-6 flex justify-between">
          <div>
            <p className="text-indigo-200 text-xs">Welcome back</p>
            <h2 className="text-white text-2xl font-bold">
              {user.email.split('.23')[0].toUpperCase()}
            </h2>
            <p className="text-indigo-200 text-sm">
              {profile?.department} · Sem {profile?.currentSemester}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white text-3xl font-bold">
              {profile?.currentCgpa || '—'}
            </p>
          </div>
        </div>

        {/* ✅ FIXED COUNTS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Eligible Drives"
            value={getValue(eligibleCount)}
            color="indigo"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
          />
          <StatCard
            label="Applied"
            value={getValue(appliedCount)}
            color="amber"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>}
          />
          <StatCard
            label="In Process"
            value={getValue(inProcessCount)}
            color="rose"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          />
          <StatCard
            label="Selected"
            value={getValue(selectedCount)}
            color="emerald"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>}
          />
        </div>

        {/* Links & Timeline container */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-5">Application Timeline</h3>

            {activeApps.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <p className="text-gray-500 text-sm">No recent application activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeApps.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {a.driveInfo?.companyName?.slice(0, 1) || 'C'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{a.driveInfo?.companyName}</p>
                        <p className="text-xs text-gray-400">Application update</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      a.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-700' :
                      a.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                      a.status === 'INPROCESS' ? 'bg-amber-100 text-amber-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 mb-2 px-1">Quick Links</h3>
            {[
              { to: '/student/drives', label: 'Browse Eligible Drives', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { to: '/student/applications', label: 'My Applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { to: '/student/profile', label: 'Manage Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
            ].map(link => (
              <Link key={link.to} to={link.to} className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-indigo-300 hover:shadow-md transition group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={link.icon}/></svg>
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-indigo-700 transition">{link.label}</span>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}