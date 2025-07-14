"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Eye, Heart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsData {
  totalViews: number
  totalLikes: number
  totalInteractions: number
  topDesign: {
    title: string
    views: number
    likes: number
  }
}

export function RealTimeStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/analytics")
        if (response.ok) {
          const data = await response.json()

          // Process analytics data
          const totalViews = data.reduce((sum: number, item: any) => sum + item.totalViews, 0)
          const totalLikes = data.reduce((sum: number, item: any) => sum + item.totalLikes, 0)
          const topDesign = data[0] // Most viewed design

          setStats({
            totalViews,
            totalLikes,
            totalInteractions: totalViews + totalLikes,
            topDesign: {
              title: "Top Design", // You'd get this from design data
              views: topDesign?.totalViews || 0,
              likes: topDesign?.totalLikes || 0,
            },
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={stats.totalViews}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold"
            >
              {stats.totalViews.toLocaleString()}
            </motion.div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={stats.totalLikes}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-red-500"
            >
              {stats.totalLikes.toLocaleString()}
            </motion.div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={stats.totalInteractions}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-green-500"
            >
              {stats.totalInteractions.toLocaleString()}
            </motion.div>
            <p className="text-xs text-muted-foreground">Total interactions</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
