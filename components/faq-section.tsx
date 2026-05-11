"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    id: "1",
    question: "How do I book an appointment?",
    answer:
      "You can easily book an appointment through our website by clicking the 'Book Now' button, or call any of our locations directly. We recommend booking 24-48 hours in advance for the best availability.",
  },
  {
    id: "2",
    question: "What should I do before my appointment?",
    answer:
      "We recommend arriving 5-10 minutes early to check in and relax. Please remove any existing nail polish before your appointment. If you have any allergies or sensitivities, let us know when booking.",
  },
  {
    id: "3",
    question: "How long do gel nails last?",
    answer:
      "With proper care, gel nails typically last 2-3 weeks without chipping. We recommend scheduling a fill or new set every 2-3 weeks to maintain their appearance and the health of your natural nails.",
  },
  {
    id: "4",
    question: "Do you offer bridal or group packages?",
    answer:
      "Yes! We love hosting bridal parties and special group events. We offer customized packages for weddings, birthdays, and corporate events. Contact us for a personalized quote and to reserve your date.",
  },
  {
    id: "5",
    question: "What is your cancellation policy?",
    answer:
      "We understand plans change. We request at least 24 hours notice for cancellations or rescheduling. Late cancellations or no-shows may be subject to a fee equal to 50% of the service cost.",
  },
  {
    id: "6",
    question: "Are your products safe and cruelty-free?",
    answer:
      "Absolutely! We use only premium, salon-grade products that are free from harmful chemicals. All our products are cruelty-free and many are vegan-friendly. Ask your technician about specific product ingredients.",
  },
]

export function FaqSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="font-sans text-sm font-medium tracking-widest uppercase text-primary">
            FAQ
          </span>
          <h2 className="mt-4 font-sans text-4xl font-semibold text-foreground sm:text-5xl">
            Common Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-lg text-muted-foreground">
            Find answers to frequently asked questions about our services.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <AccordionItem
                  value={faq.id}
                  className="rounded-2xl border border-border bg-card px-6 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="font-sans text-lg font-medium text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-base leading-relaxed text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
