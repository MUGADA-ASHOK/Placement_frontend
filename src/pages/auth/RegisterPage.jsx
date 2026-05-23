import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/services'

function PasswordInput({ label, value, onChange, placeholder, hint }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="text-gray-400 text-xs font-medium block mb-1">{label}</label>
      <div className="flex items-center border border-gray-700 rounded-xl px-4 h-10 bg-gray-900 focus-within:border-indigo-500 transition overflow-hidden">
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange}
          placeholder={placeholder} className="w-full outline-none text-sm bg-transparent text-white placeholder-gray-700" />
        <button type="button" onClick={() => setShow(s => !s)} className="text-gray-500 hover:text-gray-300 ml-2 shrink-0">
          {show
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          }
        </button>
      </div>
      {hint && <p className="text-xs text-gray-600 mt-0.5 pl-1">{hint}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ rollNo: '', name: '', surname: '', email: '', mobileNo: '', password: '', confirmPw: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!form.rollNo || form.rollNo.length !== 12) return 'Roll number must be exactly 12 characters.'
    if (!form.name || !form.surname) return 'Name and surname are required.'
    if (!form.email.endsWith('@anits.edu.in')) return 'Email must be a valid @anits.edu.in address.'
    if (!/^[6-9]\d{9}$/.test(form.mobileNo)) return 'Enter a valid 10-digit Indian mobile number.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPw) return 'Passwords do not match.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true); setError('')
    try {
      await authApi.registerStudent({ rollNo: form.rollNo, name: form.name, surname: form.surname, email: form.email, mobileNo: form.mobileNo, password: form.password })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-900 flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7"/></svg>
        </div>
        <p className="text-white font-semibold">Registration Successful!</p>
        <p className="text-gray-400 text-sm">Your account has been created.</p>
        <button onClick={() => navigate('/login')} className="w-full h-11 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
          Go to Sign In →
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Brand */}
      <div className="hidden lg:flex lg:w-[380px] shrink-0 flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-violet-700">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition w-fit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </Link>
        <div className="space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">🎓</div>
          <div>
            <h1 className="text-3xl font-bold text-white">Join ANITS Placements</h1>
            <p className="text-white/70 mt-3 text-sm leading-relaxed">Register with your college roll number to start your placement journey.</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl space-y-1.5 text-white/60 text-xs">
            <p>• Valid @anits.edu.in email</p>
            <p>• 12-character roll number</p>
            <p>• 10-digit Indian mobile (starts 6-9)</p>
            <p>• Password min 8 characters</p>
          </div>
        </div>
        <p className="text-white/40 text-xs">© 2025 ANITS Placement Cell</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          <Link to="/" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs mb-6 transition lg:hidden">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </Link>
          <div className="mb-6">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Student Portal</p>
            <h2 className="text-white text-2xl font-bold mt-1">Create Account</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-950 border border-red-800 rounded-xl px-4 py-2.5 mb-4">
              <svg width="14" height="14" className="text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              ['rollNo', 'Roll No', 'text', '21B91A0501 (12 chars)'],
              ['name', 'First Name', 'text', 'e.g. Arjun'],
              ['surname', 'Surname', 'text', 'e.g. Reddy'],
              ['email', 'College Email', 'email', 'rollno@anits.edu.in'],
              ['mobileNo', 'Mobile No', 'tel', '10-digit mobile (starts 6-9)'],
            ].map(([key, label, type, ph]) => (
              <div key={key}>
                <label className="text-gray-400 text-xs font-medium block mb-1">{label}</label>
                <div className="flex items-center border border-gray-700 rounded-xl px-4 h-10 bg-gray-900 focus-within:border-indigo-500 transition overflow-hidden">
                  <input type={type} value={form[key]} onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setError('') }}
                    placeholder={ph} className="w-full outline-none text-sm bg-transparent text-white placeholder-gray-700" />
                </div>
              </div>
            ))}
            <PasswordInput label="Password" value={form.password}
              onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError('') }}
              placeholder="min 8 characters" hint="Must be at least 8 characters" />
            <PasswordInput label="Confirm Password" value={form.confirmPw}
              onChange={e => { setForm(p => ({ ...p, confirmPw: e.target.value })); setError('') }}
              placeholder="repeat your password" />
            <button type="submit" disabled={loading}
              className="w-full h-11 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Registering...</> : 'Register →'}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
