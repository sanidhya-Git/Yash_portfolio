"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Calendar, Plus, Trash2, Edit, Eye, Heart, TrendingUp, ArrowLeft, Upload, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RealTimeStats } from "@/components/real-time-stats"

// Type definitions
interface Booking {
  _id: string
  name: string
  email: string
  phone?: string
  service: string
  date: string
  time: string
  status: string
  message?: string
  createdAt?: string
  updatedAt?: string
}

interface Design {
  _id: string
  title: string
  category: string
  description?: string
  image: string
  likes: number
  views: number
  status: string
  createdAt?: string
  updatedAt?: string
}

interface DesignFormProps {
  design?: Design | null
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isEditing?: boolean
}

interface StatItem {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [designs, setDesigns] = useState<Design[]>([])
  const [isAddingDesign, setIsAddingDesign] = useState(false)
  const [editingDesign, setEditingDesign] = useState<Design | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Fetch data dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, designsRes] = await Promise.all([fetch("/api/bookings"), fetch("/api/designs/admin")])

        if (bookingsRes.ok) {
          const bookingsData: Booking[] = await bookingsRes.json()
          setBookings(bookingsData)
        }

        if (designsRes.ok) {
          const designsData: Design[] = await designsRes.json()
          setDesigns(designsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // Fallback to mock data
        setBookings([
          {
            _id: "1",
            name: "Sarah Chen",
            email: "sarah@techstart.com",
            service: "Web Design",
            date: "2024-01-15",
            time: "10:00",
            status: "confirmed",
            message: "Need a complete website redesign for our startup",
          },
        ])
        setDesigns([
          {
            _id: "1",
            title: "Modern E-commerce Platform",
            category: "Web Design",
            image: "/placeholder.svg?height=400&width=600",
            likes: 124,
            views: 2340,
            status: "published",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])




  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.imageUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddDesign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    let imageUrl = "/placeholder.svg?height=400&width=600"

    if (selectedImage) {
      try {
        imageUrl = await uploadImage(selectedImage)
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        })
        return
      }
    }

    const designData = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      image: imageUrl,
    }

    try {
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(designData),
      })

      if (response.ok) {
        const newDesign = await response.json()
        const newDesignWithStats: Design = {
          ...designData,
          _id: newDesign.id,
          likes: 0,
          views: 0,
        }
        setDesigns([...designs, newDesignWithStats])
        setIsAddingDesign(false)
        setSelectedImage(null)
        setImagePreview("")
        toast({
          title: "Design Added",
          description: "New design has been added to your portfolio.",
        })
        e.currentTarget.reset()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add design. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditDesign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingDesign) return

    const formData = new FormData(e.currentTarget)

    let imageUrl = editingDesign.image

    if (selectedImage) {
      try {
        imageUrl = await uploadImage(selectedImage)
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        })
        return
      }
    }

    const designData = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      image: imageUrl,
    }

    try {
      const response = await fetch(`/api/designs/${editingDesign._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(designData),
      })

      if (response.ok) {
        setDesigns(designs.map((design) => (design._id === editingDesign._id ? { ...design, ...designData } : design)))
        setEditingDesign(null)
        setSelectedImage(null)
        setImagePreview("")
        toast({
          title: "Design Updated",
          description: "Design has been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update design. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDesign = async (id: string) => {
    try {
      const response = await fetch(`/api/designs?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDesigns(designs.filter((design) => design._id !== id))
        toast({
          title: "Design Deleted",
          description: "Design has been removed from your portfolio.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete design. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setBookings(bookings.map((booking) => (booking._id === id ? { ...booking, status } : booking)))
        toast({
          title: "Booking Updated",
          description: `Booking status changed to ${status}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      })
    }
  }

  const resetImageSelection = () => {
    setSelectedImage(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const stats: StatItem[] = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Published Designs",
      value: designs.filter((d) => d.status === "published").length,
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Total Views",
      value: designs.reduce((sum, d) => sum + (d.views || 0), 0).toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Total Likes",
      value: designs.reduce((sum, d) => sum + (d.likes || 0), 0),
      icon: Heart,
      color: "text-red-600",
    },
  ]

  const DesignForm: React.FC<DesignFormProps> = ({ design = null, onSubmit, isEditing = false }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Design title" defaultValue={design?.title || ""} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={design?.category || ""} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Web Design">Web Design</SelectItem>
            <SelectItem value="Mobile Design">Mobile Design</SelectItem>
            <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
            <SelectItem value="Branding">Branding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of the design project..."
          defaultValue={design?.description || ""}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Design Image</Label>
        <div className="space-y-4">
          {(imagePreview || design?.image) && (
            <div className="relative">
              <Image
                src={imagePreview || design?.image || "/placeholder.svg"}
                alt="Design preview"
                width={300}
                height={200}
                className="rounded-lg object-cover border"
              />
              {imagePreview && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={resetImageSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
            >
              <Upload className="mr-2 h-4 w-4" />
              {imagePreview ? "Change Image" : "Upload Image"}
            </Button>
            {selectedImage && (
              <span className="text-sm text-muted-foreground">
                {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={design?.status || "draft"} required>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={uploadingImage}>
        {uploadingImage ? "Uploading..." : isEditing ? "Update Design" : "Add Design"}
      </Button>
    </form>
  )

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-muted/30 p-6 pt-28">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-muted/30 p-6 pt-28">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>

            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your bookings and portfolio designs with real-time analytics
              </p>
            </div>

            {/* Real-time Stats */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Real-time Analytics</h2>
              <RealTimeStats />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <motion.p
                            key={stat.value}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-2xl font-bold"
                          >
                            {stat.value}
                          </motion.p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bookings Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription>Manage your upcoming meetings and consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.name}</div>
                              <div className="text-sm text-muted-foreground">{booking.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.service}</TableCell>
                          <TableCell>
                            {booking.date} at {booking.time}
                          </TableCell>
                          <TableCell>
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateBookingStatus(booking._id, "confirmed")}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateBookingStatus(booking._id, "cancelled")}
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>

            {/* Designs Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Portfolio Designs</CardTitle>
                      <CardDescription>Manage your design portfolio with real-time engagement metrics</CardDescription>
                    </div>
                    <Dialog
                      open={isAddingDesign}
                      onOpenChange={(open) => {
                        setIsAddingDesign(open)
                        if (!open) resetImageSelection()
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Design
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Design</DialogTitle>
                          <DialogDescription>Add a new design to your portfolio with image upload</DialogDescription>
                        </DialogHeader>
                        <DesignForm onSubmit={handleAddDesign} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {designs.map((design) => (
                      <Card key={design._id} className="overflow-hidden">
                        <div className="relative">
                          <Image
                            src={design.image || "/placeholder.svg"}
                            alt={design.title}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                          <Badge
                            className="absolute top-2 right-2"
                            variant={design.status === "published" ? "default" : "secondary"}
                          >
                            {design.status}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{design.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{design.category}</p>
                          {design.description && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{design.description}</p>
                          )}
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            <motion.div
                              key={`likes-${design.likes}`}
                              initial={{ scale: 1.1 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-1"
                            >
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="font-medium">{design.likes || 0}</span>
                            </motion.div>
                            <motion.div
                              key={`views-${design.views}`}
                              initial={{ scale: 1.1 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="font-medium">{design.views || 0}</span>
                            </motion.div>
                          </div>
                          <div className="flex gap-2">
                            <Dialog
                              open={editingDesign?._id === design._id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setEditingDesign(design)
                                } else {
                                  setEditingDesign(null)
                                  resetImageSelection()
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                  <Edit className="mr-1 h-3 w-3" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Design</DialogTitle>
                                  <DialogDescription>Update your design information and image</DialogDescription>
                                </DialogHeader>
                                <DesignForm design={editingDesign} onSubmit={handleEditDesign} isEditing />
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => handleDeleteDesign(design._id)}
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
