import type {
  AvailabilityResponse,
  Branch,
  CreateBookingRequest,
  Employee,
  GalleryImage,
  Promotion,
  Service,
  ServiceCategory,
  Testimonial,
} from "@/lib/types"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://nail-salon-gilt.vercel.app/api"

type QueryValue = string | number | boolean | undefined | null

function buildUrl(path: string, query: Record<string, QueryValue> = {}) {
  const baseUrl =
    typeof window === "undefined" ? API_BASE_URL : window.location.origin + "/api"
  const url = new URL(`${baseUrl}${path}`)

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

async function apiFetch<T>(
  path: string,
  query?: Record<string, QueryValue>,
  init?: RequestInit
) {
  const { headers, next: _next, ...rest } =
    (init as RequestInit & { next?: unknown }) ?? {}
  const requestInit: RequestInit & { next?: { revalidate: number } } = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers as Record<string, string> | undefined),
    },
  }

  if (!init?.method && typeof window === "undefined") {
    requestInit.next = { revalidate: 60 }
  }

  const res = await fetch(buildUrl(path, query), requestInit)

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`)
  }

  return res.json() as Promise<T>
}

export async function getActiveBranches(limit = 20) {
  const data = await apiFetch<{
    success: boolean
    total: number
    branches: Branch[]
  }>("/branches", { status: "active", limit })

  return data.branches ?? []
}

export async function getActiveServices(options: {
  limit?: number
  category?: ServiceCategory
  popular?: boolean
} = {}) {
  const data = await apiFetch<{
    success: boolean
    total: number
    services: Service[]
  }>("/services", {
    status: "active",
    limit: options.limit ?? 50,
    category: options.category,
    popular: options.popular ? "true" : undefined,
  })

  return data.services ?? []
}

export async function getActiveEmployees(branchId?: string) {
  const data = await apiFetch<{
    success: boolean
    total: number
    employees: Employee[]
  }>("/employees", { status: "active", branchId, limit: 50 })

  return data.employees ?? []
}

export async function getActiveTestimonials(options: {
  limit?: number
  featured?: boolean
} = {}) {
  const data = await apiFetch<{
    success: boolean
    total: number
    testimonials: Testimonial[]
  }>("/testimonials", {
    status: "active",
    featured: options.featured ? "true" : undefined,
    limit: options.limit ?? 4,
  })

  return data.testimonials ?? []
}

export async function getActiveGalleryImages(options: {
  limit?: number
  featured?: boolean
} = {}) {
  const data = await apiFetch<{
    success: boolean
    total: number
    images: GalleryImage[]
  }>("/gallery", {
    status: "active",
    featured: options.featured ? "true" : undefined,
    limit: options.limit ?? 6,
  })

  return data.images ?? []
}

export async function getActivePromotions(limit = 3) {
  const data = await apiFetch<{
    success: boolean
    total: number
    promotions: Promotion[]
  }>("/promotions", { status: "active", active: "true", limit })

  return data.promotions ?? []
}

export async function getAvailability(params: {
  branchId: string
  date: string
  employeeId?: string
  duration?: number
}) {
  return apiFetch<AvailabilityResponse>("/bookings/availability", params)
}

export async function createBooking(data: CreateBookingRequest) {
  return apiFetch<{ success: boolean; message: string; booking: unknown }>(
    "/bookings",
    undefined,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
}
