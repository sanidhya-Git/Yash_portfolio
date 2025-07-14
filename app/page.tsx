"use client"

import React from "react"

import type { ReactElement } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Calendar, Eye, Heart, Star, Code, Palette, Zap } from "lucide-react"
import Link from "next/link"
import { useRef, useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { OptimizedImage } from "@/components/optimized-image"
import { useOptimizedFetch } from "@/hooks/use-optimized-fetch"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { debounce, throttle } from "@/lib/cache"
import type { Design } from "@/types"

export default function HomePage(): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Optimized data fetching with caching
  const {
    data: designs = [],
    loading,
    refetch,
  } = useOptimizedFetch<Design[]>("/api/designs", {
    cache: true,
    cacheTTL: 2 * 60 * 1000, // 2 minutes cache
  })

  const [likedDesigns, setLikedDesigns] = useState(new Set<string>())
  const [viewedDesigns, setViewedDesigns] = useState(new Set<string>())
  const { toast } = useToast()

  // Load liked designs from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem("likedDesigns")
    if (savedLikes) {
      try {
        setLikedDesigns(new Set(JSON.parse(savedLikes)))
      } catch (error) {
        console.error("Error parsing saved likes:", error)
      }
    }
  }, [])

  // Optimized real-time updates with throttling
  const updateStats = useCallback(
    throttle(async () => {
      try {
        const response = await fetch("/api/designs/stats")
        if (response.ok) {
          const stats: Array<{ _id: string; likes: number; views: number }> = await response.json()
          // Update designs with new stats (this would need to be handled by the parent state)
          refetch() // Refetch data to get latest stats
        }
      } catch (error) {
        console.error("Error fetching real-time stats:", error)
      }
    }, 5000), // Throttle to max once per 5 seconds
    [refetch],
  )

  useEffect(() => {
    const interval = setInterval(updateStats, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [updateStats])

  // Optimized like handler with debouncing
  const handleLike = useCallback(
    debounce(async (designId: string, e: React.MouseEvent) => {
      e.stopPropagation()

      const isLiked = likedDesigns.has(designId)
      const newLikedDesigns = new Set(likedDesigns)

      // Optimistic update
      if (isLiked) {
        newLikedDesigns.delete(designId)
      } else {
        newLikedDesigns.add(designId)
      }
      setLikedDesigns(newLikedDesigns)
      localStorage.setItem("likedDesigns", JSON.stringify([...newLikedDesigns]))

      try {
        const response = await fetch(`/api/designs/${designId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: isLiked ? "unlike" : "like" }),
        })

        if (!response.ok) {
          // Revert optimistic update on error
          setLikedDesigns(likedDesigns)
          localStorage.setItem("likedDesigns", JSON.stringify([...likedDesigns]))
          throw new Error("Failed to update like")
        }

        toast({
          title: isLiked ? "Removed from favorites" : "Added to favorites",
          description: isLiked ? "Design removed from your favorites." : "Design added to your favorites!",
        })
      } catch (error) {
        console.error("Error toggling like:", error)
        toast({
          title: "Error",
          description: "Failed to update like. Please try again.",
          variant: "destructive",
        })
      }
    }, 300),
    [likedDesigns, toast],
  )

  // Optimized view tracking
  const handleDesignView = useCallback(
    debounce(async (designId: string) => {
      if (viewedDesigns.has(designId)) return

      setViewedDesigns((prev) => new Set([...prev, designId]))

      try {
        await fetch(`/api/designs/${designId}/view`, { method: "POST" })
      } catch (error) {
        console.error("Error incrementing view count:", error)
      }
    }, 1000),
    [viewedDesigns],
  )

const designCards = useMemo(() => {
  return (designs ?? []).map((design, index) => (
    <DesignCard
      key={design._id}
      design={design}
      index={index}
      isLiked={likedDesigns.has(design._id)}
      onLike={handleLike}
      onView={handleDesignView}
    />
  ));
}, [designs, likedDesigns, handleLike, handleDesignView]);


  return (
    <div>
      <Header />

      <div ref={containerRef} className="min-h-screen pt-16">
        {/* Optimized Hero Section */}
        <HeroSection y={y} opacity={opacity} />

        {/* About Section */}
        <AboutSection />

        {/* Portfolio Section with optimized rendering */}
        <section id="work" className="py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Work</h2>
              <p className="text-xl text-muted-foreground">A selection of my recent projects and design explorations</p>
            </motion.div>

            {loading ? <SkeletonGrid /> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{designCards}</div>}
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <CTASection />
      </div>

      <Footer />
    </div>
  )
}

// Memoized components for better performance
const DesignCard = React.memo(
  ({
    design,
    index,
    isLiked,
    onLike,
    onView,
  }: {
    design: Design
    index: number
    isLiked: boolean
    onLike: (designId: string, e: React.MouseEvent) => void
    onView: (designId: string) => void
  }) => {
    const { ref, isIntersecting } = useIntersectionObserver({
      threshold: 0.5,
      triggerOnce: true,
    })

    useEffect(() => {
      if (isIntersecting) {
        onView(design._id)
      }
    }, [isIntersecting, design._id, onView])

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        data-design-id={design._id}
      >
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="relative overflow-hidden">
            <OptimizedImage
              src={design.image || "/placeholder.svg"}
              alt={design.title}
              width={600}
              height={400}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              priority={index < 3} // Prioritize first 3 images
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button variant="secondary" size="sm">
                View Project
              </Button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => onLike(design._id, e)}
              className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                isLiked ? "bg-red-500/80 text-white" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </motion.button>
          </div>

          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{design.title}</h3>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{design.category}</span>
            </div>
            {design.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{design.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span className={isLiked ? "text-red-500 font-medium" : ""}>{design.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{design.views || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  },
)

const HeroSection = React.memo(({ y, opacity }: { y: any; opacity: any }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
    <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
    </motion.div>

    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="flex items-center justify-center space-x-4 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Palette className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Code className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Zap className="h-8 w-8 text-white" />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          Crafting Digital
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
            Experiences
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8">Where creativity meets functionality</p>

        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          Transforming ideas into stunning digital realities through innovative design solutions, user-centered
          experiences, and cutting-edge technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-200">
            <a href="#work">Explore My Work</a>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-black bg-transparent"
            asChild
          >
            <Link href="/book">
              <Calendar className="mr-2 h-5 w-5" />
              Let's Collaborate
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>

    {/* Optimized particles with reduced count */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  </section>
))

const AboutSection = React.memo(() => (
  <section id="about" className="py-20 px-4 bg-background">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          With over 8 years of experience in digital design, I help brands and businesses create compelling visual
          stories that resonate with their audience.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <OptimizedImage
            src="/placeholder.svg?height=500&width=500"
            alt="Alex Johnson"
            width={500}
            height={500}
            className="rounded-2xl shadow-2xl"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-semibold">My Design Philosophy</h3>
          <p className="text-muted-foreground">
            I believe great design is not just about aesthetics—it's about solving problems and creating meaningful
            connections between brands and their users.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
))

const TestimonialsSection = React.memo(() => (
  <section className="py-20 px-4 bg-background">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">What Clients Say</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            name: "Sarah Chen",
            role: "CEO, TechStart",
            content:
              "Alex transformed our brand identity completely. The attention to detail and creative vision exceeded our expectations.",
            rating: 5,
          },
          {
            name: "Michael Rodriguez",
            role: "Product Manager, InnovateCorp",
            content:
              "Working with Alex was a game-changer for our mobile app design. User engagement increased by 40% after the redesign.",
            rating: 5,
          },
          {
            name: "Emily Johnson",
            role: "Marketing Director, GrowthCo",
            content:
              "Professional, creative, and always delivers on time. Alex is our go-to designer for all major projects.",
            rating: 5,
          },
        ].map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 h-full">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
))

const CTASection = React.memo(() => (
  <section className="py-20 px-4 bg-black text-white">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto text-center"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
      <p className="text-xl mb-8 text-gray-300">
        Let's collaborate and bring your vision to life with exceptional design.
      </p>
      <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
        <Link href="/book">
          <Calendar className="mr-2 h-5 w-5" />
          Schedule a Consultation
        </Link>
      </Button>
    </motion.div>
  </section>
))

const SkeletonGrid = React.memo(() => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-muted rounded-lg h-64 mb-4"></div>
        <div className="bg-muted rounded h-4 mb-2"></div>
        <div className="bg-muted rounded h-3 w-2/3"></div>
      </div>
    ))}
  </div>
))

DesignCard.displayName = "DesignCard"
HeroSection.displayName = "HeroSection"
AboutSection.displayName = "AboutSection"
TestimonialsSection.displayName = "TestimonialsSection"
CTASection.displayName = "CTASection"
SkeletonGrid.displayName = "SkeletonGrid"
