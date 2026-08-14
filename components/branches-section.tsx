"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star, Phone, ArrowRight } from "lucide-react"
import { BRAND_NAME, displaySalonName } from "@/lib/brand"
import type { Branch } from "@/lib/types"

const fallbackBranches = [
  {
    id: "naperville",
    name: BRAND_NAME,
    address: "25 S Washington St",
    city: "Naperville, IL 60540",
    phone: "(630) 961-1111",
    rating: 4.9,
    reviews: 256,
    hours: "Mon-Sat: 9 AM - 7 PM",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
  },
]

interface BranchesSectionProps {
  branches?: Branch[]
}

function formatHours(openingTime?: string, closingTime?: string) {
  if (!openingTime || !closingTime) return "Hours vary by location"
  return `${openingTime} - ${closingTime}`
}

export function BranchesSection({ branches: apiBranches = [] }: BranchesSectionProps) {
  const branches =
    apiBranches.length > 0
      ? apiBranches.slice(0, 4).map((branch) => ({
          id: branch.id,
          name: displaySalonName(branch.name),
          address: branch.address,
          city: branch.location,
          phone: branch.phoneNumber,
          rating: 5,
          reviews: branch._count?.bookings ?? 0,
          hours: formatHours(branch.openingTime, branch.closingTime),
          image: branch.image ?? "/placeholder.jpg",
        }))
      : fallbackBranches

  return (
    <section className="py-24 bg-secondary/30" id="locations">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="font-sans text-sm font-medium tracking-widest uppercase text-primary">
            Our Locations
          </span>
          <h2 className="mt-4 font-sans text-4xl font-semibold text-foreground sm:text-5xl">
            Visit Us Today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-lg text-muted-foreground">
            Visit {BRAND_NAME} in downtown Naperville and experience the ultimate in nail care 
            and beauty services.
          </p>
        </motion.div>

        {/* Branches Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="group"
            >
              <div className="flex flex-col overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-500 hover:shadow-xl sm:flex-row">
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-auto sm:w-2/5">
                  <Image
                    src={branch.image}
                    alt={branch.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-sans text-xl font-semibold text-foreground">
                        {branch.name}
                      </h3>
                      <div className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        <span className="font-sans text-sm font-medium text-foreground">
                          {branch.rating}
                        </span>
                        <span className="font-sans text-xs text-muted-foreground">
                          ({branch.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                        <div className="font-sans text-sm">
                          <p>{branch.address}</p>
                          <p>{branch.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="font-sans text-sm">
                          {branch.hours}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <a 
                          href={`tel:${branch.phone}`}
                          className="font-sans text-sm hover:text-primary transition-colors"
                        >
                          {branch.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/branches" className="flex items-center gap-2">
              View All Locations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
