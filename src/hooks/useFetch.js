import { useState, useEffect, useCallback } from 'react'

export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFn()
      // handle both { data: { data: [] } } and { data: [] }
      let payload = res.data?.data ?? res.data
      if (payload && typeof payload === 'object' && !Array.isArray(payload) && Array.isArray(payload.content)) {
        payload = payload.content
      }
      setData(payload)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line

  useEffect(() => { execute() }, [execute])

  return { data, loading, error, refetch: execute }
}
