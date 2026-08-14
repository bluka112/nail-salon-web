"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Sparkles, Star } from "lucide-react"
import { Footer } from "@/components/footer"
import { MobileBookingButton } from "@/components/mobile-booking-button"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import type { Service, ServiceCategory } from "@/lib/types"

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

interface ServicesPageContentProps {
  services: Service[]
}

function buildServiceCategories(services: Service[]) {
  return (Object.keys(categoryMeta) as ServiceCategory[])
    .map((category) => ({
      id: category,
      ...categoryMeta[category],
      services: services.filter((service) => service.category === category),
    }))
    .filter((category) => category.services.length > 0)
}

export function ServicesPageContent({ services }: ServicesPageContentProps) {
  const serviceCategories = buildServiceCategories(services)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

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

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {serviceCategories.length > 0 ? (
            serviceCategories.map((category) => (
              <motion.div
                key={category.id}
                id={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-20 last:mb-0"
              >
                <div className="mb-10">
                  <h2 className="font-sans text-3xl font-semibold text-foreground sm:text-4xl">
                    {category.title}
                  </h2>
                  <p className="mt-2 font-sans text-lg text-muted-foreground">
                    {category.description}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service, serviceIndex) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: serviceIndex * 0.1, duration: 0.5 }}
                      className="group"
                    >
                      <div className="h-full overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-500 hover:shadow-xl">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={service.image ?? "/placeholder.jpg"}
                            alt={service.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-sans text-xl font-semibold text-foreground">
                              {service.name}
                            </h3>
                            <span className="font-sans text-xl font-semibold text-primary whitespace-nowrap">
                              ${service.price}
                            </span>
                          </div>

                          <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                            {service.description ?? "Premium nail care service."}
                          </p>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="font-sans text-sm">
                                {service.duration} min
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
            ))
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="font-sans text-2xl font-semibold text-foreground">
                Services are unavailable right now
              </h2>
              <p className="mx-auto mt-3 max-w-xl font-sans text-muted-foreground">
                We could not load Trio Nail Studio services from the API. Please try again shortly
                or call the salon to book.
              </p>
            </div>
          )}
        </div>
      </section>

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
