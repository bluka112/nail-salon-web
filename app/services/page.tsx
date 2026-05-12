import { ServicesPageContent } from "@/components/services-page-content"
import { getActiveServices } from "@/lib/api"
import type { Service } from "@/lib/types"

export const revalidate = 60

export default async function ServicesPage() {
  let services: Service[] = []

  try {
    services = await getActiveServices({ limit: 100 })
  } catch {
    services = []
  }

  return <ServicesPageContent services={services} />
}
