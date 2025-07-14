"use client"

import { motion } from "framer-motion"
import { Calendar, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Work", href: "#work" },
    { name: "About Me", href: "#about" },
    { name: "Resume", href: "/resume.pdf" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name */}
          <Link href="/" className="text-xl font-bold hover:text-primary transition-colors">
            Yash Bansal
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                target={item.name === "Resume" ? "_blank" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Schedule Call Button */}
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/book">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Call
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-6 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                    target={item.name === "Resume" ? "_blank" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild className="w-full">
                  <Link href="/book" onClick={() => setIsOpen(false)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Call
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
