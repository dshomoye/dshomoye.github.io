const { GraphQLClient } = require("graphql-request")
const webpush = require("web-push")

const hasuraEndpoint = "https://dshomoye.hasura.app/v1/graphql"
const hasuraAdminKey = process.env.HASURA_ADMIN_KEY

const client = new GraphQLClient(hasuraEndpoint, {
  headers: {
    "x-hasura-admin-secret": hasuraAdminKey,
  },
})

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

const getAllSubscriptions = async () => {
  const query = `query MyQuery {
    push_subscriptions {
      subscription
    }
  }`
  try {
    const data = await client.request(query)
    const subscriptions = data.push_subscriptions
    return subscriptions
  } catch (error) {
    console.error("error getting subs ", error)
    return []
  }
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
      const subscriptions = await getAllSubscriptions()
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
        body: `{"error": "Unsupportd method"}`,
      }
  }
}
