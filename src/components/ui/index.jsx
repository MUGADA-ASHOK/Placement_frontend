import { useState as _useState } from 'react'

// ── Button (conic-gradient shine effect from PrebuiltUI) ──────
export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const sz = size === 'sm' ? 'px-4 py-1.5 text-xs' : size === 'lg' ? 'px-8 py-3 text-sm' : 'px-6 py-2 text-sm'
  const spinnerEl = loading ? (
    <svg className="w-3.5 h-3.5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  ) : null

  if (variant === 'secondary' || variant === 'ghost') {
    return (
      <button
        className={`inline-flex items-center justify-center gap-2 font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed ${sz} ${className}`}
        disabled={loading || props.disabled} {...props}
      >
        {spinnerEl}{children}
      </button>
    )
  }

  const gradients = {
    primary: 'conic-gradient(from 0deg,#6366f1,#1e1b4b,#1e1b4b,#6366f1,#1e1b4b,#1e1b4b,#1e1b4b,#6366f1)',
    success: 'conic-gradient(from 0deg,#10b981,#064e3b,#064e3b,#10b981,#064e3b,#064e3b,#064e3b,#10b981)',
    danger:  'conic-gradient(from 0deg,#ef4444,#7f1d1d,#7f1d1d,#ef4444,#7f1d1d,#7f1d1d,#7f1d1d,#ef4444)',
  }
  const innerBg = { primary: 'bg-indigo-900', success: 'bg-emerald-900', danger: 'bg-red-900' }
  const id = `btn-shine-${variant}`

  return (
    <>
      <style>{`
        @keyframes btn-shine-anim {
          0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}
        }
        .${id} {
          background: ${gradients[variant] || gradients.primary};
          background-size: 300% 300%;
          animation: btn-shine-anim 6s ease-out infinite;
        }
      `}</style>
      <div className={`${id} rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100 inline-flex ${className}`}>
        <button
          className={`flex items-center justify-center gap-2 font-medium rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed ${innerBg[variant] || innerBg.primary} ${sz}`}
          disabled={loading || props.disabled} {...props}
        >
          {spinnerEl}{children}
        </button>
      </div>
    </>
  )
}

// ── Input (PrebuiltUI pill style with icon support) ───────────
export function Input({ label, error, className = '', icon, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className={`flex items-center h-10 pl-3 border rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden ${error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}>
        {icon && <span className="mr-2 flex-shrink-0 text-slate-400">{icon}</span>}
        <input
          className={`h-full px-2 w-full outline-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 pl-3 mt-0.5">{error}</p>}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        className={`w-full p-3 bg-transparent border border-slate-300 rounded-xl resize-none outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm placeholder:text-slate-400 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 pl-1 mt-0.5">{error}</p>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────
export function Select({ label, error, options = [], value, onChange, name, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className={`relative border rounded-full bg-white focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden ${error ? 'border-red-400' : 'border-slate-300'}`}>
        <select
          name={name} value={value} onChange={onChange}
          className="w-full h-10 px-4 pr-8 text-sm text-slate-800 bg-transparent outline-none appearance-none cursor-pointer"
        >
          <option value="">— Select —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && <p className="text-xs text-red-600 pl-3 mt-0.5">{error}</p>}
    </div>
  )
}

// ── Checkbox (PrebuiltUI blue check) ─────────────────────────
export function Checkbox({ label, name, checked, onChange }) {
  return (
    <label className="flex gap-3 items-center cursor-pointer select-none">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="hidden peer" />
      <span className="w-5 h-5 border border-slate-300 rounded relative flex items-center justify-center flex-shrink-0 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-colors">
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="m10.092.952-.005-.006-.006-.005A.45.45 0 0 0 9.43.939L4.162 6.23 1.585 3.636a.45.45 0 0 0-.652 0 .47.47 0 0 0 0 .657l.002.002L3.58 6.958a.8.8 0 0 0 .567.242.78.78 0 0 0 .567-.242l5.333-5.356a.474.474 0 0 0 .044-.65Z" fill="#F5F7FF" stroke="#F5F7FF" strokeWidth=".4"/>
        </svg>
      </span>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
}

// ── Toggle ────────────────────────────────────────────────────
export function Toggle({ label, name, checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer gap-3 select-none">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-500 transition-colors duration-200 flex-shrink-0"></div>
      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6 shadow-sm"></span>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, className = '', tilt = false, onClick }) {
  if (tilt) return <TiltCard className={className} onClick={onClick}>{children}</TiltCard>
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

function TiltCard({ children, className = '', onClick }) {
  const [tilt, setTilt] = _useState({ x: 0, y: 0 })
  const thresh = 8
  const handleMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - top) / height - 0.5) * -thresh, y: ((e.clientX - left) / width - 0.5) * thresh })
  }
  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-transform duration-200 ease-out cursor-pointer bg-white border border-gray-200 ${className}`}
      onMouseMove={handleMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600', green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-indigo-50 text-indigo-600', amber: 'bg-amber-50 text-amber-600', red: 'bg-red-50 text-red-600',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ children, color = 'gray' }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-600', green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-indigo-100 text-indigo-700', red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700', purple: 'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

// ── Table (gradient header from PrebuiltUI) ───────────────────
export function Table({ columns, data, onRowClick, loading, emptyMsg = 'No data found' }) {
  if (loading) return <div className="py-12 text-center"><svg className="w-7 h-7 animate-spin text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>
  if (!data?.length) return <div className="py-12 text-center text-gray-400 text-sm">{emptyMsg}</div>
  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-indigo-700 uppercase tracking-wide whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={`border-b border-gray-100 last:border-0 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-indigo-50/40' : 'hover:bg-gray-50/50'}`}
              onClick={() => onRowClick?.(row)}>
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-700">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Modal (with backdrop blur) ────────────────────────────────
export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${width} max-h-[90vh] overflow-y-auto border border-gray-200`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 active:scale-95 transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ── ConfirmModal (PrebuiltUI trash/confirm style) ─────────────
export function ConfirmModal({ open, onClose, onConfirm, title = 'Are you sure?', message = 'This action cannot be undone.', loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 w-[370px] md:w-[460px] border border-gray-200">
        <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-gray-900 font-semibold mt-4 text-xl">{title}</h2>
        <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>
        <div className="flex items-center justify-center gap-4 mt-5 w-full">
          <button onClick={onClose} className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition disabled:opacity-50">
            {loading ? 'Loading...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Alert (icon + styled from PrebuiltUI) ─────────────────────
export function Alert({ type = 'error', message }) {
  if (!message) return null
  const cfg = {
    error:   { cls: 'text-red-700 border-red-200 bg-red-50',       icon: <path d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-9a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1z" fill="currentColor"/> },
    success: { cls: 'text-emerald-700 border-emerald-200 bg-emerald-50', icon: <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" fill="currentColor"/> },
    info:    { cls: 'text-indigo-700 border-indigo-200 bg-indigo-50',   icon: <path d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1z" fill="currentColor"/> },
    warning: { cls: 'text-amber-700 border-amber-200 bg-amber-50',     icon: <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-8a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1z" fill="currentColor"/> },
  }
  const c = cfg[type] || cfg.info
  return (
    <div className={`flex items-center gap-3 text-sm py-3 px-4 border rounded-lg ${c.cls}`}>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">{c.icon}</svg>
      <span>{message}</span>
    </div>
  )
}

// ── Spinner ────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>
  )
}

// ── Tabs (indigo underline) ───────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((tab) => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${active === tab.key ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ── StatusBadge ───────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    ELIGIBLE: { color: 'blue', label: 'Eligible' }, APPLIED: { color: 'purple', label: 'Applied' },
    INPROCESS: { color: 'amber', label: 'In Process' }, SELECTED: { color: 'green', label: 'Selected' },
    REJECTED: { color: 'red', label: 'Rejected' }, PENDING: { color: 'gray', label: 'Pending' },
    CLEARED: { color: 'green', label: 'Cleared' }, FAILED: { color: 'red', label: 'Failed' },
  }
  const s = map[status] || { color: 'gray', label: status }
  return <Badge color={s.color}>{s.label}</Badge>
}

// ── Pagination (PrebuiltUI arrows) ────────────────────────────
export function Pagination({ page, total, perPage = 10, onChange }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1)
  const ArrowSvg = ({ flip }) => (
    <svg className={flip ? 'rotate-180' : ''} width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
    </svg>
  )
  return (
    <div className="flex items-center justify-between w-full max-w-80 text-gray-500 font-medium mx-auto mt-4">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="rounded-full bg-slate-200/50 disabled:opacity-40 transition hover:bg-slate-200">
        <ArrowSvg />
      </button>
      <div className="flex items-center gap-1 text-sm font-medium">
        {pages.map((p) => (
          <button key={p} onClick={() => onChange(p)}
            className={`h-9 w-9 flex items-center justify-center rounded-full transition ${page === p ? 'text-indigo-500 border border-indigo-200 bg-indigo-50' : 'hover:bg-indigo-50'}`}>
            {p}
          </button>
        ))}
      </div>
      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-full bg-slate-200/50 disabled:opacity-40 transition hover:bg-slate-200">
        <ArrowSvg flip />
      </button>
    </div>
  )
}
