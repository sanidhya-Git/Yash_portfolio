"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, Mail, MessageSquare, ArrowLeft, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const bookingData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      date: formData.get("date"),
      time: formData.get("time"),
      message: formData.get("message"),
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        // Send email notification
        await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "booking_confirmation",
            to: bookingData.email,
            bookingData,
          }),
        })

        setIsSubmitted(true)
        toast({
          title: "Booking Submitted!",
          description: "I'll get back to you within 24 hours to confirm your appointment.",
        })
      } else {
        throw new Error("Failed to submit booking")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const SuccessAnimation = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <h2 className="text-3xl font-bold mb-4 text-green-600">Successfully Submitted!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for your booking request. I'll review your information and get back to you within 24 hours to
          confirm your appointment.
        </p>
        <p className="text-sm text-muted-foreground mb-8">A confirmation email has been sent to your inbox.</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Book Another Meeting
        </Button>
      </motion.div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * 400,
              y: Math.random() * 400,
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <Sparkles className="h-4 w-4 text-green-400" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div>
      <Header />

      <div className="min-h-screen py-12 px-4 pt-28">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Portfolio
                </Link>

                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Book a Meeting</h1>
                  <p className="text-xl text-muted-foreground">
                    Let's discuss your project and how I can help bring your vision to life
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Schedule Your Consultation
                      </CardTitle>
                      <CardDescription>
                        Fill out the form below and I'll get back to you within 24 hours
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="service">Service Needed</Label>
                          <Select name="service" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="web-design">Web Design</SelectItem>
                              <SelectItem value="mobile-app">Mobile App Design</SelectItem>
                              <SelectItem value="branding">Brand Identity</SelectItem>
                              <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                              <SelectItem value="consultation">Design Consultation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Preferred Date</Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Preferred Time</Label>
                            <Select name="time" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                <SelectItem value="14:00">2:00 PM</SelectItem>
                                <SelectItem value="15:00">3:00 PM</SelectItem>
                                <SelectItem value="16:00">4:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Project Details</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell me about your project, goals, and any specific requirements..."
                            rows={4}
                          />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="mr-2"
                            >
                              <Clock className="h-4 w-4" />
                            </motion.div>
                          ) : null}
                          {isSubmitting ? "Submitting..." : "Book Meeting"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Meeting Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Duration</h4>
                          <p className="text-muted-foreground">30-60 minutes depending on project complexity</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Format</h4>
                          <p className="text-muted-foreground">
                            Video call via Zoom, Google Meet, or in-person (if local)
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">What to Expect</h4>
                          <ul className="text-muted-foreground space-y-1">
                            <li>• Project requirements discussion</li>
                            <li>• Timeline and budget overview</li>
                            <li>• Design process explanation</li>
                            <li>• Q&A session</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>Yashbansal@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span>+91 9784511533</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <SuccessAnimation />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  )
}
