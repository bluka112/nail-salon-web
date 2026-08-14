"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star, Phone, ArrowRight, Car, Train } from "lucide-react"
import { BRAND_NAME, displaySalonName } from "@/lib/brand"
import { getActiveBranches } from "@/lib/api"
import type { Branch } from "@/lib/types"

const fallbackBranches = [
  {
    id: "naperville",
    name: BRAND_NAME,
    tagline: "Premium nail care in Chicago",
    address: "332 N Desplaines St",
    area: "Chicago",
    city: "Chicago, IL 60661",
    phone: "(312) 575-0108",
    rating: 4.9,
    reviews: 256,
    hours: {
      weekday: "Mon-Sat: 9 AM - 7 PM",
      weekend: "Sunday hours may vary",
    },
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    features: ["LGBTQ+ Friendly", "Chicago", "Premium Services"],
    transport: "332 N Desplaines St, Chicago, IL 60661",
  },
]

function formatHours(openingTime?: string, closingTime?: string) {
  if (!openingTime || !closingTime) {
    return {
      weekday: "Hours vary by location",
      weekend: "Contact salon for availability",
    }
  }

  return {
    weekday: `Mon-Sat: ${openingTime} - ${closingTime}`,
    weekend: "Sun: Contact salon for availability",
  }
}

function buildBranches(branches: Branch[]) {
  if (branches.length === 0) return fallbackBranches

  return branches.map((branch) => ({
    id: branch.id,
    name: displaySalonName(branch.name),
    tagline: `Luxury nail care in ${branch.location}`,
    address: branch.address,
    area: branch.location,
    city: branch.location,
    phone: branch.phoneNumber,
    rating: 5,
    reviews: branch._count?.bookings ?? 0,
    hours: formatHours(branch.openingTime, branch.closingTime),
    image: branch.image ?? "/placeholder.jpg",
    features: ["Premium Services", "Expert Technicians"],
    transport: "Open maps for directions",
  }))
}

export default function BranchesPage() {
  const [apiBranches, setApiBranches] = useState<Branch[]>([])

  useEffect(() => {
    getActiveBranches(50)
      .then(setApiBranches)
      .catch(() => setApiBranches([]))
  }, [])

  const branches = buildBranches(apiBranches)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background pt-32 pb-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <MapPin className="h-4 w-4" />
              <span className="font-sans font-medium tracking-wider uppercase">
                Our Locations
              </span>
            </div>

            <h1 className="mt-6 font-sans text-5xl font-semibold text-foreground sm:text-6xl">
              Find Your Nearest Salon
            </h1>

            <p className="mx-auto mt-6 max-w-2xl font-sans text-lg text-muted-foreground">
              Visit {BRAND_NAME} at 332 N Desplaines St in Chicago, IL. 
              Our salon offers premium nail care, beauty services, and a welcoming experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Branches List */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-500 hover:shadow-xl">
                  <div className="grid lg:grid-cols-5">
                    {/* Image */}
                    <div className="relative aspect-[4/3] lg:col-span-2 lg:aspect-auto">
                      <Image
                        src={branch.image}
                        alt={branch.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Rating Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-card/90 px-3 py-1.5 backdrop-blur-sm">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-sans text-sm font-semibold text-foreground">
                          {branch.rating}
                        </span>
                        <span className="font-sans text-xs text-muted-foreground">
                          ({branch.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:col-span-3">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h2 className="font-sans text-2xl font-semibold text-foreground sm:text-3xl">
                            {branch.name}
                          </h2>
                          <p className="mt-1 font-sans text-primary">
                            {branch.tagline}
                          </p>

                          {/* Contact Info */}
                          <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                                <div className="font-sans text-sm text-muted-foreground">
                                  <p>{branch.address}</p>
                                  <p>{branch.area}</p>
                                  <p>{branch.city}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Train className="h-5 w-5 flex-shrink-0 text-primary" />
                                <span className="font-sans text-sm text-muted-foreground">
                                  {branch.transport}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                                <div className="font-sans text-sm text-muted-foreground">
                                  <p>{branch.hours.weekday}</p>
                                  <p>{branch.hours.weekend}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                                <a
                                  href={`tel:${branch.phone}`}
                                  className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {branch.phone}
                                </a>
                              </div>

                            </div>
                          </div>

                          {/* Features */}
                          <div className="mt-6 flex flex-wrap gap-2">
                            {branch.features.map((feature) => (
                              <span
                                key={feature}
                                className="rounded-full bg-secondary px-3 py-1 font-sans text-xs text-secondary-foreground"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                          <Button asChild variant="outline" className="rounded-full flex-1 sm:flex-none">
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(
                                `${branch.address}, ${branch.city}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <Car className="h-4 w-4" />
                              Get Directions
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-sans text-3xl font-semibold text-foreground sm:text-4xl">
              All Locations
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-lg text-muted-foreground">
              Find {BRAND_NAME} in Chicago.
            </p>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-12 aspect-[16/9] overflow-hidden rounded-3xl bg-muted"
          >
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 font-sans text-muted-foreground">
                  Interactive map coming soon
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
