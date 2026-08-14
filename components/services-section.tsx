"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"
import type { Service } from "@/lib/types"

interface ServicesSectionProps {
  services?: Service[]
}

function formatPrice(price: number) {
  return `$${price}`
}

function formatDuration(duration: number) {
  return `${duration} min`
}

export function ServicesSection({ services: apiServices = [] }: ServicesSectionProps) {
  const services = apiServices.slice(0, 8).map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description ?? "Premium nail care service.",
    duration: formatDuration(service.duration),
    price: formatPrice(service.price),
    image: service.image ?? "/placeholder.jpg",
  }))

  return (
    <section className="py-24 bg-background" id="services">
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
            Our Services
          </span>
          <h2 className="mt-4 font-sans text-4xl font-semibold text-foreground sm:text-5xl">
            Indulge in Luxury
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-lg text-muted-foreground">
            From classic manicures to artistic nail designs, we offer a complete range 
            of premium beauty services tailored to your desires.
          </p>
        </motion.div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-500 hover:shadow-xl">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  {/* Hover CTA */}
                  <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <Button asChild size="sm" className="rounded-full">
                      <Link href="/booking" className="flex items-center gap-2">
                        Book Now
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans text-lg font-semibold text-foreground">
                      {service.name}
                    </h3>
                    <span className="font-sans text-lg font-semibold text-primary">
                      {service.price}
                    </span>
                  </div>
                  
                  <p className="mt-2 font-sans text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-sans text-sm">
                      {service.duration}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-sans text-muted-foreground">
              Services are loading from Trio Nail Studio right now. Please check back shortly.
            </p>
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/services" className="flex items-center gap-2">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
