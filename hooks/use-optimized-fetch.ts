"use client"

import { useState, useEffect, useCallback } from "react"
import { clientCache } from "@/lib/cache"

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface FetchOptions {
  cache?: boolean
  cacheTTL?: number
  immediate?: boolean
}

export function useOptimizedFetch<T>(
  url: string,
  options: FetchOptions = {},
): FetchState<T> & { refetch: () => Promise<void> } {
  const { cache = true, cacheTTL = 5 * 60 * 1000, immediate = true } = options

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchData = useCallback(async () => {
    // Check cache first
    if (cache) {
      const cachedData = clientCache.get(url)
      if (cachedData) {
        setState({ data: cachedData, loading: false, error: null })
        return
      }
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Cache the result
      if (cache) {
        clientCache.set(url, data, cacheTTL)
      }

      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      })
    }
  }, [url, cache, cacheTTL])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [fetchData, immediate])

  return { ...state, refetch: fetchData }
}
