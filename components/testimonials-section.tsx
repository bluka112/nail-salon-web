"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import type { Testimonial } from "@/lib/types"

const fallbackTestimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Regular Client",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "Absolutely the best nail salon I've ever visited! The attention to detail is incredible, and the atmosphere is so relaxing. My nails have never looked better.",
  },
  {
    id: 2,
    name: "Emily Chen",
    role: "First-time Visitor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "From the moment I walked in, I felt pampered. The staff is so professional and friendly. The gel manicure lasted for weeks without chipping!",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "VIP Member",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    rating: 5,
    text: "I've been coming here for over two years now. The consistency in quality is remarkable. They always remember my preferences and make me feel special.",
  },
  {
    id: 4,
    name: "Amanda Rodriguez",
    role: "Bridal Party",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    rating: 5,
    text: "Had my bridal party pampered here and it was magical! Every single person was thrilled with their nails. The perfect start to my wedding day.",
  },
]

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
}

export function TestimonialsSection({
  testimonials: apiTestimonials = [],
}: TestimonialsSectionProps) {
  const testimonials =
    apiTestimonials.length > 0
      ? apiTestimonials.slice(0, 4).map((testimonial) => ({
          id: testimonial.id,
          name: testimonial.name,
          role: testimonial.service ?? "Client",
          image: testimonial.image ?? "/placeholder-user.jpg",
          rating: testimonial.rating,
          text: testimonial.comment,
        }))
      : fallbackTestimonials

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

        {/* Testimonials Grid */}
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
      </div>
    </section>
  )
}
