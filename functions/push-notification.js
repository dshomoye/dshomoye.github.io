const got = require("got")
const webpush = require('web-push')

const faunadbEndpoint = "https://graphql.fauna.com/graphql"
const faunaKey = process.env.FAUNADB_KEY
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${faunaKey}`,
}
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidPublicKey = "BIzWFRNmUmy6ztKkoYNJOaDudQOrbhK5zHDmeCSDX6m3L5yVd5f6Bv3xMPf6A5Cf2-X4pPULKYjL7-ddmLRKcBA"

webpush.setVapidDetails(
  'mailto:email@dshomoye.dev',
  vapidPublicKey,
  vapidPrivateKey
)

const getAllSubscriptions = async () => {
  const query = `query {
    allPushNotificationSubscriptions{
      data {
        endpoint
      }
    }
  }`
  try {
    const res = await got(faunadbEndpoint, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({query: query})

    })
    const resultData = JSON.parse(res.body)
    const subscriptions = resultData.data.allPushNotificationSubscriptions.data
    return subscriptions
  } catch (error) {
    console.error('error getting subs ', error)
    return []
  }
}

const sendPushMsg = async (subscription, message) => {
  try {
    webpush.sendNotification(subscription, message)
    return true
  } catch (error) {
    console.error('Failed to send message to endpoint', error)
    return false
  }
}


exports.handler = async (event) => {
  const method = event.httpMethod
  const eventData = JSON.parse(event.body)
  switch (method) {
    case 'POST':
      const subscriptions = await getAllSubscriptions()
      const promises = subscriptions.map(subscription => await sendPushMsg(subscription, eventData))
      const result = await Promise.all(promises)
      const failed = result.filter(success => !success).length
      return {
        statusCode: 201,
        body: JSON.stringify({
          failed: failed,
          success: result.length - failed
        })
      }
    default:
      return {
        statusCode: 400,
        body: "Unsupported request"
      }
  }
}