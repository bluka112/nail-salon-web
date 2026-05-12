"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import type { Testimonial } from "@/lib/types"

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
}

export function TestimonialsSection({
  testimonials: apiTestimonials = [],
}: TestimonialsSectionProps) {
  const testimonials = apiTestimonials.slice(0, 4).map((testimonial) => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.service ?? "Client",
    image: testimonial.image ?? "/placeholder-user.jpg",
    rating: testimonial.rating,
    text: testimonial.comment,
  }))

  return (
    <section className="py-24 bg-background overflow-hidden">
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
            Testimonials
          </span>
          <h2 className="mt-4 font-sans text-4xl font-semibold text-foreground sm:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-lg text-muted-foreground">
            Discover why thousands of clients trust us with their beauty needs.
          </p>
        </motion.div>

        {testimonials.length > 0 ? (
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="group"
            >
              <div className="relative rounded-3xl bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-xl">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="h-16 w-16 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Text */}
                <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-8 flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-sans text-lg font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="font-sans text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-sans text-muted-foreground">
              Testimonials are loading from Elegance right now. Please check back shortly.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
