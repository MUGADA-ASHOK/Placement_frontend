import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <p className="text-6xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">403</p>
        <h1 className="text-white text-2xl font-bold mt-4">Access Denied</h1>
        <p className="text-gray-400 text-sm mt-2">You don't have permission to access this page.</p>
        <Link to="/login" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back to Login
        </Link>
      </div>
    </div>
  )
}
