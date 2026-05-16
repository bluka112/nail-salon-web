import { API_BASE_URL } from "@/lib/api"

type RouteContext = {
  params: Promise<{ path: string[] }>
}

async function proxyRequest(request: Request, context: RouteContext) {
  const { path } = await context.params
  const incomingUrl = new URL(request.url)
  const targetUrl = new URL(`${API_BASE_URL}/${path.join("/")}`)

  incomingUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value)
  })

  const headers = new Headers()
  const contentType = request.headers.get("content-type")
  const authorization = request.headers.get("authorization")

  if (contentType) headers.set("Content-Type", contentType)
  if (authorization) headers.set("Authorization", authorization)

  const hasBody = !["GET", "HEAD"].includes(request.method)
  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  })

  const responseHeaders = new Headers()
  const responseContentType = response.headers.get("content-type")
  const responseCacheControl = response.headers.get("cache-control")

  if (responseContentType) responseHeaders.set("Content-Type", responseContentType)
  if (responseCacheControl) responseHeaders.set("Cache-Control", responseCacheControl)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  })
}

export async function GET(request: Request, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function POST(request: Request, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyRequest(request, context)
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyRequest(request, context)
}
