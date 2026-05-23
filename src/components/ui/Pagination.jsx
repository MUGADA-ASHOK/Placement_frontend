/**
 * Pagination — styled exactly to the provided design.
 *
 * Props:
 *   page        {number}   — current 0-based page index
 *   totalPages  {number}   — total page count
 *   onPage      {function} — called with the 0-based page index to navigate to
 */
export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null

  // Build a sliding window of up to 5 page buttons
  const windowSize = 5
  let start = Math.max(0, page - Math.floor(windowSize / 2))
  let end   = start + windowSize
  if (end > totalPages) {
    end   = totalPages
    start = Math.max(0, end - windowSize)
  }
  const pageNums = Array.from({ length: end - start }, (_, i) => start + i)

  const PrevArrow = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
    </svg>
  )

  const NextArrow = () => (
    <svg className="rotate-180" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
    </svg>
  )

  return (
    <div className="flex items-center justify-between w-full max-w-80 text-gray-500 font-medium mx-auto">
      <button
        type="button"
        aria-label="prev"
        onClick={() => page > 0 && onPage(page - 1)}
        disabled={page === 0}
        className="rounded-full bg-slate-200/50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <PrevArrow />
      </button>

      <div className="flex items-center gap-2 text-sm font-medium">
        {pageNums.map(p => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`h-10 w-10 flex items-center justify-center aspect-square transition ${
              p === page
                ? 'text-indigo-500 border border-indigo-200 rounded-full'
                : 'hover:text-indigo-400'
            }`}
          >
            {p + 1}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="next"
        onClick={() => page + 1 < totalPages && onPage(page + 1)}
        disabled={page + 1 >= totalPages}
        className="rounded-full bg-slate-200/50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <NextArrow />
      </button>
    </div>
  )
}
