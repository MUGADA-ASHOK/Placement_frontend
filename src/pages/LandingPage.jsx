import { Link } from 'react-router-dom'

const portals = [
  {
    label: 'Student Portal',
    grad: 'from-indigo-600 to-violet-700',
    desc: 'Browse eligible placement drives, apply with one click, and track your application round by round.',
    url: '/register',
    emoji: '🎓',
  },
  {
    label: 'Company Portal',
    grad: 'from-emerald-600 to-teal-700',
    desc: 'Manage your drives, publish selection rounds, and filter the best candidates by score or top-K.',
    url: '/login',
    emoji: '🏢',
  },
  {
    label: 'Admin Portal',
    grad: 'from-slate-700 to-slate-900',
    desc: 'Oversee the entire placement lifecycle — students, companies, drives, eligibility and applications.',
    url: '/login',
    emoji: '⚙️',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">ANITS Placements</span>
        </div>
        <p className="text-gray-500 text-xs hidden md:block">Anil Neerukonda Institute of Technology &amp; Sciences</p>
        <Link to="/login" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition active:scale-95">
          Sign In →
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Welcome</p>
        <h1 className="text-white text-4xl md:text-5xl font-bold text-center leading-tight">Choose your portal</h1>
        <p className="text-gray-400 text-base mt-3 text-center max-w-md">
          Each role has its own dedicated access. Select the portal that matches your role.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 w-full max-w-4xl">
          {portals.map((p) => (
            <Link key={p.label} to={p.url}
              className="group text-left bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 hover:shadow-2xl hover:shadow-black/40 transition-all duration-200 active:scale-[0.98]">
              <div className={`bg-gradient-to-br ${p.grad} px-6 py-6 flex items-center justify-between`}>
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                  {p.emoji}
                </div>
                <svg className="text-white opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
              <div className="px-6 py-5">
                <h3 className="text-white font-bold text-base">{p.label}</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-lg w-full">
          {[['50+', 'Companies'], ['200+', 'Drives/Year'], ['95%', 'Placement Rate'], ['18 LPA', 'Highest Pkg']].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-white font-bold text-xl">{v}</p>
              <p className="text-gray-500 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-6">
        <p className="text-gray-700 text-xs">© 2025 ANITS Placement Cell · All rights reserved</p>
      </div>
    </div>
  )
}
