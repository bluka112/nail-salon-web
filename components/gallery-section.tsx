"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram, ArrowRight } from "lucide-react"
import type { GalleryImage } from "@/lib/types"

const fallbackGalleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Elegant French manicure design",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&q=80",
    alt: "Artistic nail art with flowers",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&q=80",
    alt: "Relaxing pedicure treatment",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=80",
    alt: "Gel nail application",
    span: "col-span-1 row-span-1",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=400&q=80",
    alt: "Creative nail designs",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&q=80",
    alt: "Luxury spa treatment",
    span: "col-span-2 row-span-1",
  },
]

interface GallerySectionProps {
  images?: GalleryImage[]
}

const spans = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
]

export function GallerySection({ images: apiImages = [] }: GallerySectionProps) {
  const galleryImages =
    apiImages.length > 0
      ? apiImages.slice(0, 6).map((image, index) => ({
          id: image.id,
          src: image.image,
          alt: image.title ?? image.category ?? "Nail salon gallery image",
          span: spans[index] ?? "col-span-1 row-span-1",
        }))
      : fallbackGalleryImages

  return (
    <section className="py-24 bg-secondary/30">
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
            Our Gallery
          </span>
          <h2 className="mt-4 font-sans text-4xl font-semibold text-foreground sm:text-5xl">
            Nail Art Inspiration
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-lg text-muted-foreground">
            Browse our portfolio of stunning nail designs and spa treatments.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-3"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-2xl ${image.span}`}
            >
              <div className="relative h-full min-h-[200px] w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-foreground/0 transition-all duration-500 group-hover:bg-foreground/40" />
                
                {/* Instagram Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/90">
                    <Instagram className="h-5 w-5 text-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="h-5 w-5" />
              Follow Us on Instagram
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
