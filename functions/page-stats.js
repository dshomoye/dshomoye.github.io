const { get, put } = require("./kvstoreclient")

const buildKey = (pathname, hostname) =>
  `dshomoye.dev:page_stats:likes:${hostname}:${pathname}`

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
})

const parseBody = (body) => {
  try {
    return JSON.parse(body || "{}")
  } catch {
    return null
  }
}

const isValidPayload = (payload = {}) => {
  if (typeof payload.pathname !== "string" || typeof payload.hostname !== "string") {
    return false
  }
  if (!payload.pathname.startsWith("/") || payload.pathname.length > 300) {
    return false
  }
  return /^[a-z0-9.-]+$/i.test(payload.hostname) && payload.hostname.length <= 253
}

const getPageLikes = async (pathname, hostname) => {
  const res = await get(buildKey(pathname, hostname))
  return res
}

const updatePageLike = async (pathname, hostname, by = 1) => {
  const current = await getPageLikes(pathname, hostname)
  if (!current) {
    const nextVal = by > 0 ? by : 0
    await put(buildKey(pathname, hostname), nextVal)
    return nextVal
  } else {
    let count = parseInt(current, 10)
    count += by
    if (count < 0) count = 0
    await put(buildKey(pathname, hostname), count)
    return count
  }
}

exports.handler = async (event) => {
  if (event.httpMethod != "POST") {
    return json(404, { error: "Not Found" })
  }
  const eventData = parseBody(event.body)
  if (!eventData || !isValidPayload(eventData.payload)) {
    return json(400, { error: "Invalid request" })
  }

  if (eventData.action === "get_likes") {
    const { pathname, hostname } = eventData.payload
    let res = await getPageLikes(pathname, hostname)
    if (!res) {
      return json(200, { likes: 0 })
    } else {
      return json(200, { likes: parseInt(res, 10) || 0 })
    }
  } else if (
    eventData.action === "add_like" ||
    eventData.action === "remove_like"
  ) {
    const { pathname, hostname } = eventData.payload
    let res = await updatePageLike(
      pathname,
      hostname,
      eventData.action === "remove_like" ? -1 : 1
    )
    return json(200, { likes: res })
  }

  return json(400, { error: "Unsupported action" })
}
