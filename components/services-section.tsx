"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"
import type { Service } from "@/lib/types"

const fallbackServices = [
  {
    id: 1,
    name: "Luxury Manicure",
    description: "Classic nail shaping, cuticle care, and polish application with premium products.",
    duration: "45 min",
    price: "$45",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80",
  },
  {
    id: 2,
    name: "Spa Pedicure",
    description: "Relaxing foot soak, exfoliation, massage, and perfect polish finish.",
    duration: "60 min",
    price: "$65",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&q=80",
  },
  {
    id: 3,
    name: "Gel Nails",
    description: "Long-lasting gel polish with chip-free shine that lasts up to 3 weeks.",
    duration: "75 min",
    price: "$75",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&q=80",
  },
  {
    id: 4,
    name: "Acrylic Extensions",
    description: "Custom nail extensions with durable acrylic for length and strength.",
    duration: "90 min",
    price: "$95",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=80",
  },
  {
    id: 5,
    name: "Nail Art",
    description: "Express your style with intricate designs, patterns, and embellishments.",
    duration: "30+ min",
    price: "From $25",
    image: "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=400&q=80",
  },
  {
    id: 6,
    name: "Spa Treatment",
    description: "Complete pampering with hot stone massage, masks, and aromatherapy.",
    duration: "90 min",
    price: "$120",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80",
  },
  {
    id: 7,
    name: "Waxing Services",
    description: "Gentle and effective hair removal with premium wax formulas.",
    duration: "15-45 min",
    price: "From $20",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&q=80",
  },
  {
    id: 8,
    name: "Eyelash Extensions",
    description: "Beautiful, natural-looking lash extensions for stunning eyes.",
    duration: "120 min",
    price: "$150",
    image: "https://images.unsplash.com/photo-1583001809873-a128495da465?w=400&q=80",
  },
]

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
  const services =
    apiServices.length > 0
      ? apiServices.slice(0, 8).map((service) => ({
          id: service.id,
          name: service.name,
          description: service.description ?? "Premium nail care service.",
          duration: formatDuration(service.duration),
          price: formatPrice(service.price),
          image: service.image ?? "/placeholder.jpg",
        }))
      : fallbackServices

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
