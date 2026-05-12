"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Clock,
  Check,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  User,
  Calendar as CalendarIcon,
  CreditCard,
  CheckCircle,
  Star,
  Loader2,
} from "lucide-react"
import { format, isBefore, startOfDay } from "date-fns"
import {
  createBooking,
  getActiveBranches,
  getActiveEmployees,
  getActiveServices,
  getAvailability,
} from "@/lib/api"
import type { Branch, Employee, Service } from "@/lib/types"

const anyTechnicianId = "__any__"

function toDisplayTime(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":")
  const hour = Number(hours)
  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes.padStart(2, "0")} ${suffix}`
}

const steps = [
  { id: 1, label: "Location", icon: MapPin },
  { id: 2, label: "Service", icon: Sparkles },
  { id: 3, label: "Technician", icon: User },
  { id: 4, label: "Date & Time", icon: CalendarIcon },
  { id: 5, label: "Details", icon: CreditCard },
  { id: 6, label: "Confirmed", icon: CheckCircle },
]

function BookingContent() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [apiBranches, setApiBranches] = useState<Branch[]>([])
  const [apiServices, setApiServices] = useState<Service[]>([])
  const [apiEmployees, setApiEmployees] = useState<Employee[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmationId, setConfirmationId] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  const branches = apiBranches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    address: branch.address ?? branch.location,
    rating: 5,
  }))

  const services = apiServices.map((service) => ({
    id: service.id,
    name: service.name,
    duration: `${service.duration} min`,
    durationMinutes: service.duration,
    price: service.price,
  }))

  const technicians = [
    { id: anyTechnicianId, name: "Any Available", specialty: "All Services", image: null },
    ...apiEmployees.map((employee) => ({
      id: employee.id,
      name: employee.name,
      specialty: employee.title || employee.specialties.join(", ") || "Nail Technician",
      image: employee.image,
    })),
  ]

  useEffect(() => {
    Promise.all([getActiveBranches(50), getActiveServices({ limit: 100 })])
      .then(([loadedBranches, loadedServices]) => {
        setApiBranches(loadedBranches)
        setApiServices(loadedServices)
      })
      .catch(() => {
        setApiBranches([])
        setApiServices([])
        setLoadError("We couldn't load booking data from the API. Please refresh and try again.")
      })
      .finally(() => setIsLoadingData(false))
  }, [])

  useEffect(() => {
    setApiEmployees([])
    setSelectedTechnician(null)
    if (!selectedBranch) return

    setIsLoadingEmployees(true)
    getActiveEmployees(selectedBranch)
      .then(setApiEmployees)
      .catch(() => setApiEmployees([]))
      .finally(() => setIsLoadingEmployees(false))
  }, [selectedBranch])

  // Load available slots when date, branch, technician, or duration changes.
  useEffect(() => {
    if (!selectedDate || !selectedBranch) {
      setAvailableSlots([])
      return
    }

    const date = format(selectedDate, "yyyy-MM-dd")
    setIsLoadingSlots(true)
    setSelectedTime(null)

    getAvailability({
      branchId: selectedBranch,
      date,
      employeeId:
        selectedTechnician && selectedTechnician !== anyTechnicianId
          ? selectedTechnician
          : undefined,
      duration: getTotalDuration() || 60,
    })
      .then((data) => {
        setAvailableSlots(
          data.slots.filter((slot) => slot.available).map((slot) => slot.time)
        )
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setIsLoadingSlots(false))
  }, [selectedDate, selectedBranch, selectedTechnician, selectedServices])

  // Check for branch param in URL
  useEffect(() => {
    const branchParam = searchParams.get("branch")
    if (branchParam) {
      const branchExists = apiBranches.some((branch) => branch.id === branchParam)

      if (branchExists) {
        setSelectedBranch(branchParam)
        setCurrentStep(2)
      }
    }
  }, [searchParams, apiBranches])

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedBranch !== null
      case 2:
        return selectedServices.length > 0
      case 3:
        return selectedTechnician !== null
      case 4:
        return selectedDate && selectedTime
      case 5:
        return customerInfo.name && customerInfo.email && customerInfo.phone
      default:
        return true
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const getTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const getTotalDuration = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service?.durationMinutes || 0)
    }, 0)
  }

  const handleSubmitBooking = async () => {
    if (!canProceed() || !selectedBranch || !selectedDate || !selectedTime) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await createBooking({
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        branchId: selectedBranch,
        employeeId:
          selectedTechnician && selectedTechnician !== anyTechnicianId
            ? selectedTechnician
            : undefined,
        services: selectedServices.map((serviceId) => ({ serviceId })),
        notes: customerInfo.notes || undefined,
      })

      const booking = response.booking as { id?: string } | undefined
      setConfirmationId(booking?.id ?? `LN-${Date.now()}`)
      setCurrentStep(6)
    } catch {
      setSubmitError("We couldn't create your booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12 overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[500px]">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col items-center ${
                    index < steps.length - 1 ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-sans ${
                      currentStep >= step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Select Branch */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-sans text-3xl font-semibold text-foreground sm:text-4xl">
                  Choose Your Location
                </h1>
                <p className="mt-2 font-sans text-muted-foreground">
                  Select the salon branch most convenient for you
                </p>
              </div>

              {isLoadingData ? (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-8 font-sans text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading locations...
                </div>
              ) : loadError ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center font-sans text-sm text-destructive">
                  {loadError}
                </div>
              ) : branches.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {branches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => setSelectedBranch(branch.id)}
                      className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                        selectedBranch === branch.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          selectedBranch === branch.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-sans text-lg font-semibold text-foreground truncate">
                            {branch.name}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="font-sans text-sm">
                              {branch.rating}
                            </span>
                          </div>
                        </div>
                        <p className="mt-1 font-sans text-sm text-muted-foreground truncate">
                          {branch.address}
                        </p>
                      </div>
                      {selectedBranch === branch.id && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-8 text-center font-sans text-muted-foreground">
                  No active locations are available from the API right now.
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Select Services */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-sans text-3xl font-semibold text-foreground sm:text-4xl">
                  Select Your Services
                </h1>
                <p className="mt-2 font-sans text-muted-foreground">
                  Choose one or more services for your appointment
                </p>
              </div>

              {isLoadingData ? (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-8 font-sans text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading services...
                </div>
              ) : services.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                        selectedServices.includes(service.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans text-base font-semibold text-foreground">
                          {service.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 font-sans text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{service.duration}</span>
                          <span className="text-primary font-semibold">
                            ${service.price}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all flex-shrink-0 ml-2 ${
                          selectedServices.includes(service.id)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {selectedServices.includes(service.id) && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-8 text-center font-sans text-muted-foreground">
                  No active services are available from the API right now.
                </div>
              )}

              {selectedServices.length > 0 && (
                <div className="mt-6 rounded-2xl bg-secondary/50 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 font-sans">
                    <span className="text-muted-foreground">
                      {selectedServices.length} service(s) selected
                    </span>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">
                        Est. {getTotalDuration()} min
                      </span>
                      <span className="ml-4 text-lg font-semibold text-primary">
                        ${getTotalPrice()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Select Technician */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-sans text-3xl font-semibold text-foreground sm:text-4xl">
                  Choose Your Technician
                </h1>
                <p className="mt-2 font-sans text-muted-foreground">
                  Select your preferred nail technician or choose any available
                </p>
              </div>

              <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                {technicians.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTechnician(tech.id)}
                    className={`flex flex-col items-center rounded-2xl border-2 p-4 sm:p-6 text-center transition-all duration-300 ${
                      selectedTechnician === tech.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full bg-muted">
                      {tech.image ? (
                        <Image
                          src={tech.image}
                          alt={tech.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                        </div>
                      )}
                      {selectedTechnician === tech.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                          <Check className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="mt-3 sm:mt-4 font-sans text-base sm:text-lg font-semibold text-foreground">
                      {tech.name}
                    </h3>
                    <p className="mt-1 font-sans text-xs sm:text-sm text-muted-foreground">
                      {tech.specialty}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Select Date & Time */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-sans text-3xl font-semibold text-foreground sm:text-4xl">
                  Pick Date & Time
                </h1>
                <p className="mt-2 font-sans text-muted-foreground">
                  Choose your preferred appointment date and time
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Calendar */}
                <div className="flex justify-center">
                  <div className="rounded-2xl border border-border bg-card p-4 w-full max-w-[350px]">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) =>
                        isBefore(date, startOfDay(new Date())) ||
                        date.getDay() === 0
                      }
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="mb-4 font-sans text-xl font-semibold text-foreground">
                    {selectedDate
                      ? `Available times for ${format(selectedDate, "MMMM d, yyyy")}`
                      : "Select a date to view available times"}
                  </h3>
                  {selectedDate && isLoadingSlots && (
                    <div className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading available times...
                    </div>
                  )}
                  {selectedDate && !isLoadingSlots && availableSlots.length === 0 && (
                    <p className="font-sans text-sm text-muted-foreground">
                      No available times for this date.
                    </p>
                  )}
                  {selectedDate && !isLoadingSlots && availableSlots.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {availableSlots.map((time) => {
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-xl px-3 py-2.5 font-sans text-sm transition-all duration-200 ${
                              selectedTime === time
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                            }`}
                          >
                            {toDisplayTime(time)}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Customer Details */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-sans text-3xl font-semibold text-foreground sm:text-4xl">
                  Your Details
                </h1>
                <p className="mt-2 font-sans text-muted-foreground">
                  Fill in your contact information to complete the booking
                </p>
              </div>

              <div className="mx-auto max-w-xl">
                {/* Booking Summary */}
                <div className="mb-8 rounded-2xl bg-secondary/50 p-6">
                  <h3 className="font-sans text-lg font-semibold text-foreground mb-4">
                    Booking Summary
                  </h3>
                  <div className="space-y-3 font-sans text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium text-right">
                        {branches.find((b) => b.id === selectedBranch)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground flex-shrink-0">Services</span>
                      <span className="font-medium text-right">
                        {selectedServices
                          .map((id) => services.find((s) => s.id === id)?.name)
                          .join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Technician</span>
                      <span className="font-medium">
                        {technicians.find((t) => t.id === selectedTechnician)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Date & Time</span>
                      <span className="font-medium">
                        {selectedDate && format(selectedDate, "MMM d, yyyy")} at{" "}
                        {selectedTime ? toDisplayTime(selectedTime) : ""}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold text-primary">
                        ${getTotalPrice()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {submitError && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 font-sans text-sm text-destructive">
                      {submitError}
                    </div>
                  )}
                  <div>
                    <label className="block font-sans text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      placeholder="Enter your email"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      placeholder="Enter your phone number"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-medium text-foreground mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, notes: e.target.value })
                      }
                      placeholder="Any special requests or notes..."
                      rows={3}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 font-sans text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Confirmation */}
          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>

              <h1 className="mt-6 font-sans text-3xl font-semibold text-foreground sm:text-4xl">
                Booking Confirmed!
              </h1>
              <p className="mt-2 font-sans text-muted-foreground">
                Your appointment has been successfully scheduled
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-2xl bg-card p-6 shadow-sm">
                <div className="space-y-4 font-sans text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confirmation #</span>
                    <span className="font-mono font-semibold">
                      {confirmationId ?? "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">
                      {branches.find((b) => b.id === selectedBranch)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, "MMMM d, yyyy")} at{" "}
                      {selectedTime ? toDisplayTime(selectedTime) : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold text-primary">${getTotalPrice()}</span>
                  </div>
                </div>
              </div>

              <p className="mt-6 font-sans text-sm text-muted-foreground">
                A confirmation email has been sent to {customerInfo.email}
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/">Return to Home</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                  onClick={() => {
                    setCurrentStep(1)
                    setSelectedBranch(null)
                    setSelectedServices([])
                    setSelectedTechnician(null)
                    setSelectedDate(undefined)
                    setSelectedTime(null)
                    setCustomerInfo({ name: "", email: "", phone: "", notes: "" })
                  }}
                >
                  Book Another Appointment
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="mt-12 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={currentStep === 5 ? handleSubmitBooking : handleNext}
              disabled={!canProceed() || isSubmitting}
              className="rounded-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  {currentStep === 5 ? "Confirm Booking" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function BookingLoading() {
  return (
    <section className="pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 font-sans text-muted-foreground">
            Loading booking...
          </p>
        </div>
      </div>
    </section>
  )
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Suspense fallback={<BookingLoading />}>
        <BookingContent />
      </Suspense>
      <Footer />
    </main>
  )
}
