import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!values.email || !values.password) { setError('Email and password are required'); return }
    const result = await login(values.email, values.password)
    if (result.success) navigate(result.redirectTo)
    else setError(result.message)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Brand side */}
      <div className="hidden lg:flex lg:w-[420px] shrink-0 flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-violet-700">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition w-fit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </Link>
        <div className="space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">🎓</div>
          <div>
            <h1 className="text-3xl font-bold text-white">ANITS Placements</h1>
            <p className="text-white/70 mt-3 leading-relaxed text-sm">One login for all roles — Student, Admin, Company, and Super Admin.</p>
          </div>
          <div className="space-y-2">
            {['Track applications round by round', 'Browse eligible drives instantly', 'Admin & company dashboards', 'Real-time placement analytics'].map(f => (
              <div key={f} className="flex items-center gap-2 text-white/70 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 5 5L20 7"/></svg>
                {f}
              </div>
            ))}
          </div>
          {/* Demo credentials */}
          <div className="bg-white/10 rounded-xl p-4 text-white/60 text-xs space-y-1">
            <p className="text-white/80 font-semibold mb-2">Demo credentials:</p>
            <p>Student: 21b91a0501@anits.edu.in / pass1234</p>
            <p>Admin: admin@anits.edu.in / admin123</p>
            <p>Super Admin: super@anits.edu.in / super123</p>
            <p>Company: campus@infosys.com / infosys123</p>
          </div>
        </div>
        <p className="text-white/40 text-xs">© 2025 ANITS Placement Cell</p>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs mb-6 transition lg:hidden">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </Link>

          <div className="mb-7">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">ANITS Placement Portal</p>
            <h2 className="text-white text-2xl font-bold mt-1">Sign in</h2>
            <p className="text-gray-500 text-sm mt-1">All roles use a single login — role is auto-detected.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-950 border border-red-800 rounded-xl px-4 py-2.5 mb-4">
              <svg width="14" height="14" className="text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Email</label>
              <div className="flex items-center border border-gray-700 rounded-xl px-4 h-11 bg-gray-900 focus-within:border-indigo-500 transition overflow-hidden">
                <input type="email" value={values.email}
                  onChange={e => { setValues(p => ({ ...p, email: e.target.value })); setError('') }}
                  placeholder="your@email.com"
                  className="w-full outline-none text-sm bg-transparent text-white placeholder-gray-600" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Password</label>
              <div className="flex items-center border border-gray-700 rounded-xl px-4 h-11 bg-gray-900 focus-within:border-indigo-500 transition overflow-hidden">
                <input type={showPw ? 'text' : 'password'} value={values.password}
                  onChange={e => { setValues(p => ({ ...p, password: e.target.value })); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                  placeholder="Enter your password"
                  className="w-full outline-none text-sm bg-transparent text-white placeholder-gray-600" />
                <button type="button" onClick={() => setShowPw(s => !s)} className="text-gray-500 hover:text-gray-300 ml-2 shrink-0">
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Signing in...</>
                : 'Sign In →'
              }
            </button>
          </form>

          <p className="text-gray-600 text-xs text-center mt-5">
            New student?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
