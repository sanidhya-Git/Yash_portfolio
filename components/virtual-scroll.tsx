"use client"

import type React from "react"

import { useState, useMemo } from "react"

interface VirtualScrollProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight?: number
  containerHeight?: number
  overscan?: number
  className?: string
}

export function VirtualScroll<T>({
  items,
  renderItem,
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5,
  className = "",
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  const { startIndex, endIndex, totalHeight, offsetY } = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(items.length - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan)
    const totalHeight = items.length * itemHeight
    const offsetY = startIndex * itemHeight

    return { startIndex, endIndex, totalHeight, offsetY }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1)
  }, [items, startIndex, endIndex])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={setContainerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
        </div>
      </div>
    </div>
  )
}
