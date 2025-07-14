"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Footer() {
  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/alexjohnson",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Behance",
      href: "https://behance.net/alexjohnson",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 7.5v9c0 .825.675 1.5 1.5 1.5h21c.825 0 1.5-.675 1.5-1.5v-9c0-.825-.675-1.5-1.5-1.5h-21c-.825 0-1.5.675-1.5 1.5zm22.5-1.5v-1.5c0-.825-.675-1.5-1.5-1.5h-19c-.825 0-1.5.675-1.5 1.5v1.5h22zm-9-3h6v1.5h-6v-1.5z" />
        </svg>
      ),
    },
    {
      name: "Dribbble",
      href: "https://dribbble.com/alexjohnson",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm7.568 5.302c1.4 1.5 2.252 3.5 2.273 5.698-.653-.126-7.512-1.563-7.512-1.563s-.04-.222-.126-.556c2.071-.802 3.917-2.145 5.365-3.579zm-7.568 18.21c-2.296 0-4.404-.754-6.115-2.028.126-.302 1.596-3.245 4.407-4.407 2.707-1.126 5.587-1.278 7.483-.556-.377 1.579-1.005 3.074-1.9 4.407-1.226.905-2.73 1.432-4.375 1.432-.167 0-.333-.008-.5-.024zm8.886-2.604c-1.684 1.453-3.902 2.336-6.318 2.336-.704 0-1.378-.087-2.028-.25 1.005-1.453 1.734-3.074 2.154-4.783 1.608.377 3.074.302 4.407-.126.704 1.005 1.278 2.071 1.785 2.823zm1.432-4.783c-.704.302-1.453.453-2.228.453-1.278 0-2.479-.302-3.579-.855.126-.453.226-.93.302-1.432 1.859.377 3.74.528 5.505.302v1.532zm-.302-3.074c-1.859.226-3.74.075-5.599-.302.151-.528.327-1.056.528-1.559 2.071.679 3.917 1.734 5.071 1.861zm-7.568-8.886c2.296 0 4.404.754 6.115 2.028-.126.302-1.596 3.245-4.407 4.407-2.707 1.126-5.587 1.278-7.483.556.377-1.579 1.005-3.074 1.9-4.407 1.226-.905 2.73-1.432 4.375-1.432.167 0 .333.008.5.024z" />
        </svg>
      ),
    },
  ]

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-muted/30 border-t"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Yash Bansal. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.name}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
