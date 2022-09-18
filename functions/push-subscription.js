const { pushToSubscription } = require("./push-notification")
const { put, clear } = require("./kvstoreclient")

const buildKey = (endpoint) => `dshomoye.dev:push-subscriptions:${endpoint}`

const addSubscription = async (subscription) => {
  await put(buildKey(subscription.endpoint), JSON.stringify(subscription))
  const welcomeMsg = JSON.stringify({
    title: "Awesome!",
    message: "Push Notifications are now enabled.",
  })
  const sent = await pushToSubscription(subscription, welcomeMsg)
  return sent
}

const removeSubscription = async (endpoint) => {
  await clear(buildKey(endpoint))
}

exports.handler = async function (event) {
  const method = event.httpMethod
  switch (method) {
    case "POST":
      try {
        const addResponse = await addSubscription(JSON.parse(event.body))
        return addResponse
      } catch (error) {
        console.error("Error saving subscription ", error)
        return {
          statusCode: 400,
          body: `{"error": "Unable to process"}`,
        }
      }
    case "DELETE":
      try {
        const eventData = JSON.parse(event.body)
        const delResponse = await removeSubscription(eventData.endpoint)
        console.log("Successfully unsubsribed: ", eventData.endpoint)
        return delResponse
      } catch (error) {
        console.error("Failed to delete subscription ", error)
        return {
          statusCode: 401,
          body: `{"error": "Unable to process"}`,
        }
      }
    default:
      return {
        statusCode: 400,
        body: `{"error": "Unsupported Method"}`,
      }
  }
}
