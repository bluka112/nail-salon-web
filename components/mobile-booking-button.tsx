"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar } from "lucide-react"

export function MobileBookingButton() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 md:hidden"
    >
      <Link
        href="/booking"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Book appointment"
      >
        <Calendar className="h-6 w-6" />
      </Link>
    </motion.div>
  )
}
