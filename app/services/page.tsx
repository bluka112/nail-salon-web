"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MobileBookingButton } from "@/components/mobile-booking-button"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, Sparkles, Star } from "lucide-react"
import { getActiveServices } from "@/lib/api"
import type { Service, ServiceCategory } from "@/lib/types"

const fallbackServiceCategories = [
  {
    id: "manicure",
    title: "Manicure Services",
    description: "Classic and luxury hand treatments for perfectly polished nails.",
    services: [
      {
        name: "Classic Manicure",
        description: "Traditional nail shaping, cuticle care, hand massage, and polish application.",
        duration: "30 min",
        price: "$35",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80",
      },
      {
        name: "Luxury Manicure",
        description: "Premium treatment with exfoliation, paraffin wax, extended massage, and polish.",
        duration: "45 min",
        price: "$55",
        image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&q=80",
      },
      {
        name: "Express Manicure",
        description: "Quick nail shaping and polish for those on the go.",
        duration: "15 min",
        price: "$20",
        image: "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=500&q=80",
      },
    ],
  },
  {
    id: "pedicure",
    title: "Pedicure Services",
    description: "Relaxing foot treatments that leave you feeling refreshed.",
    services: [
      {
        name: "Classic Pedicure",
        description: "Foot soak, nail shaping, cuticle care, callus treatment, and polish.",
        duration: "45 min",
        price: "$45",
        image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500&q=80",
      },
      {
        name: "Spa Pedicure",
        description: "Luxurious treatment with exfoliation, mask, hot stone massage, and polish.",
        duration: "60 min",
        price: "$65",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80",
      },
      {
        name: "Deluxe Pedicure",
        description: "Ultimate pampering with paraffin dip, extended massage, and premium products.",
        duration: "75 min",
        price: "$85",
        image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&q=80",
      },
    ],
  },
  {
    id: "gel",
    title: "Gel & Acrylic",
    description: "Long-lasting nail enhancements for stunning results.",
    services: [
      {
        name: "Gel Polish Manicure",
        description: "Chip-free gel polish that lasts up to 3 weeks with high shine finish.",
        duration: "45 min",
        price: "$55",
        image: "https://images.unsplash.com/photo-607779097040-26e80aa78e66?w=500&q=80",
      },
      {
        name: "Gel Extensions",
        description: "Natural-looking nail extensions with durable gel for length and strength.",
        duration: "75 min",
        price: "$85",
        image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&q=80",
      },
      {
        name: "Acrylic Full Set",
        description: "Classic acrylic extensions with your choice of shape and length.",
        duration: "90 min",
        price: "$95",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80",
      },
      {
        name: "Acrylic Fill",
        description: "Maintenance fill for existing acrylic nails.",
        duration: "60 min",
        price: "$65",
        image: "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=500&q=80",
      },
    ],
  },
  {
    id: "art",
    title: "Nail Art",
    description: "Express your unique style with custom designs and embellishments.",
    services: [
      {
        name: "Simple Nail Art",
        description: "French tips, ombre, or simple patterns on select nails.",
        duration: "15 min",
        price: "From $15",
        image: "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=500&q=80",
      },
      {
        name: "Intricate Designs",
        description: "Detailed hand-painted designs, florals, or geometric patterns.",
        duration: "30 min",
        price: "From $35",
        image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=500&q=80",
      },
      {
        name: "3D Nail Art",
        description: "Stunning 3D embellishments, charms, and sculptured designs.",
        duration: "45 min",
        price: "From $50",
        image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&q=80",
      },
    ],
  },
  {
    id: "spa",
    title: "Spa Treatments",
    description: "Complete relaxation and rejuvenation for body and soul.",
    services: [
      {
        name: "Hot Stone Massage",
        description: "Relaxing hand and arm massage with heated stones.",
        duration: "30 min",
        price: "$45",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80",
      },
      {
        name: "Paraffin Treatment",
        description: "Warm paraffin wax treatment for soft, moisturized hands and feet.",
        duration: "20 min",
        price: "$25",
        image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500&q=80",
      },
      {
        name: "Aromatherapy Session",
        description: "Calming aromatherapy with essential oils and extended massage.",
        duration: "45 min",
        price: "$55",
        image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&q=80",
      },
    ],
  },
  {
    id: "additional",
    title: "Additional Services",
    description: "Complete your beauty routine with our extra services.",
    services: [
      {
        name: "Eyebrow Waxing",
        description: "Precise eyebrow shaping with gentle wax formula.",
        duration: "15 min",
        price: "$20",
        image: "https://images.unsplash.com/photo-1583001809873-a128495da465?w=500&q=80",
      },
      {
        name: "Lip Waxing",
        description: "Gentle upper lip hair removal.",
        duration: "10 min",
        price: "$12",
        image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500&q=80",
      },
      {
        name: "Eyelash Extensions",
        description: "Full set of natural-looking lash extensions.",
        duration: "120 min",
        price: "$150",
        image: "https://images.unsplash.com/photo-1583001809873-a128495da465?w=500&q=80",
      },
      {
        name: "Lash Lift & Tint",
        description: "Natural lash enhancement with lift and color.",
        duration: "60 min",
        price: "$85",
        image: "https://images.unsplash.com/photo-1583001809873-a128495da465?w=500&q=80",
      },
    ],
  },
]

const categoryMeta: Record<ServiceCategory, { title: string; description: string }> = {
  manicure: {
    title: "Manicure Services",
    description: "Classic and luxury hand treatments for perfectly polished nails.",
  },
  pedicure: {
    title: "Pedicure Services",
    description: "Relaxing foot treatments that leave you feeling refreshed.",
  },
  gel_acrylic: {
    title: "Gel & Acrylic",
    description: "Long-lasting nail enhancements for stunning results.",
  },
  nail_art: {
    title: "Nail Art",
    description: "Express your unique style with custom designs and embellishments.",
  },
  spa: {
    title: "Spa Treatments",
    description: "Complete relaxation and rejuvenation for body and soul.",
  },
  additional: {
    title: "Additional Services",
    description: "Complete your beauty routine with our extra services.",
  },
}

function buildServiceCategories(services: Service[]) {
  if (services.length === 0) return fallbackServiceCategories

  return (Object.keys(categoryMeta) as ServiceCategory[])
    .map((category) => {
      const items = services.filter((service) => service.category === category)
      return {
        id: category,
        ...categoryMeta[category],
        services: items.map((service) => ({
          id: service.id,
          name: service.name,
          description: service.description ?? "Premium nail care service.",
          duration: `${service.duration} min`,
          price: `$${service.price}`,
          image: service.image ?? "/placeholder.jpg",
        })),
      }
    })
    .filter((category) => category.services.length > 0)
}

export default function ServicesPage() {
  const [apiServices, setApiServices] = useState<Service[]>([])

  useEffect(() => {
    getActiveServices({ limit: 100 })
      .then(setApiServices)
      .catch(() => setApiServices([]))
  }, [])

  const serviceCategories = buildServiceCategories(apiServices)

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
              <Sparkles className="h-4 w-4" />
              <span className="font-sans font-medium tracking-wider uppercase">
                Our Services
              </span>
            </div>

            <h1 className="mt-6 font-sans text-5xl font-semibold text-foreground sm:text-6xl">
              Premium Beauty Services
            </h1>

            <p className="mx-auto mt-6 max-w-2xl font-sans text-lg text-muted-foreground">
              From classic manicures to intricate nail art, discover our complete range 
              of luxury beauty services designed to pamper and perfect.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {serviceCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              id={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20 last:mb-0"
            >
              {/* Category Header */}
              <div className="mb-10">
                <h2 className="font-sans text-3xl font-semibold text-foreground sm:text-4xl">
                  {category.title}
                </h2>
                <p className="mt-2 font-sans text-lg text-muted-foreground">
                  {category.description}
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service, serviceIndex) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: serviceIndex * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <div className="h-full overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-500 hover:shadow-xl">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-sans text-xl font-semibold text-foreground">
                            {service.name}
                          </h3>
                          <span className="font-sans text-xl font-semibold text-primary whitespace-nowrap">
                            {service.price}
                          </span>
                        </div>

                        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="font-sans text-sm">
                              {service.duration}
                            </span>
                          </div>

                          <Button asChild size="sm" className="rounded-full">
                            <Link href="/booking" className="flex items-center gap-2">
                              Book Now
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-accent text-accent" />
              ))}
            </div>
            <h2 className="mt-6 font-sans text-3xl font-semibold text-foreground sm:text-4xl">
              Ready to Experience Luxury?
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-lg text-muted-foreground">
              Book your appointment today and let our expert technicians 
              transform your nails into works of art.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/booking">Book Your Appointment</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/branches">Find a Location</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <MobileBookingButton />
    </main>
  )
}
