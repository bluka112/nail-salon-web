"use client"

import Link from "next/link"
import { Instagram, Facebook, Phone, MapPin } from "lucide-react"

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/elegancenailandspanaperville/",
    label: "Instagram",
  },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10">
          {/* Brand */}
          <Link href="/" className="inline-block">
            <span className="text-3xl font-semibold tracking-tight">Trio Nail Studio</span>
          </Link>

          {/* Contact Info */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <a
              href="tel:+16309611111"
              className="flex items-center gap-2 text-sm text-background/80 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              (630) 961-1111
            </a>
            <div className="hidden h-4 w-px bg-background/20 sm:block" />
            <a
              href="https://maps.google.com/?q=25%20S%20Washington%20St%2C%20Naperville%2C%20IL%2060540"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-background/80 transition-colors hover:text-primary"
            >
              <MapPin className="h-4 w-4" />
              25 S Washington St, Naperville, IL 60540
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-background/10 transition-colors hover:bg-primary"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-background/50">
            &copy; {new Date().getFullYear()} Trio Nail Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
