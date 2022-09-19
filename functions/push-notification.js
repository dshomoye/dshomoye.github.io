const webpush = require("web-push")
const { get, list } = require("./kvstoreclient")

const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidPublicKey =
  "BIzWFRNmUmy6ztKkoYNJOaDudQOrbhK5zHDmeCSDX6m3L5yVd5f6Bv3xMPf6A5Cf2-X4pPULKYjL7-ddmLRKcBA"
webpush.setVapidDetails(
  "mailto:email@dshomoye.dev",
  vapidPublicKey,
  vapidPrivateKey
)

const isAuthenticated = (event) => {
  /**
   * @type {String[]}
   */
  const apiKeys = JSON.parse(process.env.ACCESS_KEYS)
  const { headers } = event
  if ("x-api-key" in headers && apiKeys.includes(headers["x-api-key"]))
    return true
  return false
}

const allSubscriptions = async () => {
  /** @type {string[]} */
  const allKeys = await list(`dshomoye.dev:push-subscriptions:`)
  const promises = allKeys.map(async (k) => {
    const r = await get(k)
    if (typeof r === "string") {
      return JSON.parse(r)
    }
    return r
  })
  const result = await Promise.all(promises)
  return result
}

const sendPushMsg = async (subscription, message) => {
  try {
    console.log("sending for subscription ", subscription)
    const sendResult = await webpush.sendNotification(subscription, message)
    console.log("push sent, result", sendResult)
    return true
  } catch (error) {
    console.error("Failed to send message to endpoint ", error)
    return false
  }
}

exports.pushToSubscription = sendPushMsg

exports.handler = async (event) => {
  const method = event.httpMethod
  if (!isAuthenticated(event)) {
    return {
      statusCode: 401,
      body: `{"errors": "Invalid api key"}`,
    }
  }
  switch (method) {
    case "POST":
      const subscriptions = await allSubscriptions()
      const promises = subscriptions.map(async (subscription) => {
        return await sendPushMsg(subscription.subscription, event.body)
      })
      const result = await Promise.all(promises)
      const failed = result.filter((success) => !success).length
      return {
        statusCode: 201,
        body: JSON.stringify({
          failed: failed,
          success: result.length - failed,
        }),
      }
    default:
      return {
        statusCode: 400,
        body: `{"error": "Unsupported method"}`,
      }
  }
}
