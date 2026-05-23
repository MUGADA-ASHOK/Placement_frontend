import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * usePagination — page-based data fetching hook.
 *
 * Matches the backend PageResponse<T> DTO:
 *   { content, page, size, totalElements, totalPages, hasNext, hasPrevious }
 *
 * All indexes are 0-based (Spring convention).
 */
export function usePagination(fetchFn, size = 15) {
  const [items, setItems]                   = useState([])
  const [page, setPage]                     = useState(0)
  const [totalElements, setTotalElements]   = useState(null)
  const [totalPages, setTotalPages]         = useState(0)
  const [hasNextPage, setHasNextPage]       = useState(false)
  const [hasPrevPage, setHasPrevPage]       = useState(false)
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState(null)

  const fetchingRef = useRef(false)

  const fetchPage = useCallback(async (pageNum) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const res  = await fetchFn(pageNum, size)
      const body = res.data?.data ?? res.data

      const content  = body?.content       ?? (Array.isArray(body) ? body : [])
      const total    = body?.totalElements ?? content.length
      const pages    = body?.totalPages    ?? (total > 0 ? Math.ceil(total / size) : 0)

      // Use PageResponse's own hasNext / hasPrevious flags
      const nextFlag = body?.hasNext     ?? (pageNum + 1 < pages)
      const prevFlag = body?.hasPrevious ?? (pageNum > 0)

      setItems(content)
      setTotalElements(total)
      setTotalPages(pages)
      setHasNextPage(nextFlag)
      setHasPrevPage(prevFlag)
      setPage(pageNum)
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [fetchFn, size])

  // Initial fetch
  useEffect(() => {
    fetchPage(0)
  }, [fetchPage])

  const goToPage = useCallback((p) => fetchPage(p), [fetchPage])
  const nextPage = useCallback(() => { if (hasNextPage) fetchPage(page + 1) }, [hasNextPage, page, fetchPage])
  const prevPage = useCallback(() => { if (hasPrevPage) fetchPage(page - 1) }, [hasPrevPage, page, fetchPage])
  const refetch  = useCallback(() => fetchPage(page), [page, fetchPage])

  return {
    items,
    page,
    totalPages,
    totalElements,
    loading,
    error,
    hasPrev: hasPrevPage,
    hasNext: hasNextPage,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  }
}
