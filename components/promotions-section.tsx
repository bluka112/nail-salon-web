"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Gift, Crown, Heart } from "lucide-react"
import type { Promotion } from "@/lib/types"

const fallbackPromotions = [
  {
    id: 1,
    title: "First Visit Special",
    description: "Get 20% off your first service when you book online.",
    icon: Gift,
    color: "bg-primary/10 text-primary",
  },
  {
    id: 2,
    title: "Loyalty Rewards",
    description: "Earn points with every visit and redeem for free services.",
    icon: Crown,
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    id: 3,
    title: "Refer a Friend",
    description: "Both you and your friend get $15 off your next appointment.",
    icon: Heart,
    color: "bg-primary/10 text-primary",
  },
]

interface PromotionsSectionProps {
  promotions?: Promotion[]
}

const promoIcons = [Gift, Crown, Heart]
const promoColors = [
  "bg-primary/10 text-primary",
  "bg-accent/20 text-accent-foreground",
  "bg-primary/10 text-primary",
]

export function PromotionsSection({ promotions: apiPromotions = [] }: PromotionsSectionProps) {
  const promotions =
    apiPromotions.length > 0
      ? apiPromotions.slice(0, 3).map((promotion, index) => ({
          id: promotion.id,
          title: promotion.title,
          description:
            promotion.description ??
            `${promotion.discount}% off eligible services${promotion.code ? ` with code ${promotion.code}` : ""}.`,
          icon: promoIcons[index] ?? Gift,
          color: promoColors[index] ?? "bg-primary/10 text-primary",
        }))
      : fallbackPromotions

  return (
    <section className="py-24 bg-primary text-primary-foreground overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
              <Sparkles className="h-4 w-4" />
              <span className="font-sans text-sm font-medium tracking-wider uppercase">
                Special Offers
              </span>
            </div>

            <h2 className="mt-6 font-sans text-4xl font-semibold sm:text-5xl">
              Exclusive Rewards
              <br />
              <span className="text-primary-foreground/80">For You</span>
            </h2>

            <p className="mt-6 font-sans text-lg leading-relaxed text-primary-foreground/80">
              Join our rewards program and enjoy exclusive benefits, 
              special discounts, and priority booking for our premium services.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
                <Link href="/booking">Book Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/rewards">Learn More</Link>
              </Button>
            </div>
          </motion.div>

          {/* Promotion Cards */}
          <div className="space-y-4">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/15"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${promo.color}`}>
                    <promo.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-semibold">
                      {promo.title}
                    </h3>
                    <p className="mt-1 font-sans text-primary-foreground/80">
                      {promo.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
