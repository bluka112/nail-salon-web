import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { ServicesSection } from "@/components/services-section"
import { BranchesSection } from "@/components/branches-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { GallerySection } from "@/components/gallery-section"
import { PromotionsSection } from "@/components/promotions-section"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import {
  getActiveBranches,
  getActiveGalleryImages,
  getActivePromotions,
  getActiveServices,
  getActiveTestimonials,
} from "@/lib/api"

async function safeLoad<T>(loader: () => Promise<T>, fallback: T) {
  try {
    return await loader()
  } catch {
    return fallback
  }
}

export default async function HomePage() {
  const [services, branches, testimonials, galleryImages, promotions] =
    await Promise.all([
      safeLoad(() => getActiveServices({ limit: 8 }), []),
      safeLoad(() => getActiveBranches(4), []),
      safeLoad(() => getActiveTestimonials({ limit: 4 }), []),
      safeLoad(() => getActiveGalleryImages({ limit: 6 }), []),
      safeLoad(() => getActivePromotions(3), []),
    ])

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ServicesSection services={services} />
      <BranchesSection branches={branches} />
      <TestimonialsSection testimonials={testimonials} />
      <GallerySection images={galleryImages} />
      <PromotionsSection promotions={promotions} />
      <FaqSection />
      <Footer />
    </main>
  )
}
