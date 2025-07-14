export interface Booking {
  _id: string
  name: string
  email: string
  phone?: string
  service: string
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled"
  message?: string
  createdAt?: string
  updatedAt?: string
}

export interface Design {
  _id: string
  title: string
  category: string
  description?: string
  image: string
  likes: number
  views: number
  status: "published" | "draft"
  createdAt?: string
  updatedAt?: string
}

export interface Interaction {
  _id: string
  designId: string
  type: "like" | "unlike" | "view"
  timestamp: string
  userAgent?: string
  ip?: string
  sessionId?: string
}

export interface AnalyticsData {
  _id: string
  interactions: Array<{
    type: string
    date: string
    count: number
  }>
  totalLikes: number
  totalViews: number
}

export interface StatsData {
  totalViews: number
  totalLikes: number
  totalInteractions: number
  topDesign: {
    title: string
    views: number
    likes: number
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UploadResponse {
  success: boolean
  imageUrl: string
  filename: string
}
