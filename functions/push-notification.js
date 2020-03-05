const { GraphQLClient } = require("graphql-request")
const webpush = require('web-push')


const faunadbEndpoint = "https://graphql.fauna.com/graphql"
const faunaKey = process.env.FAUNADB_KEY
const graphQLClient = new GraphQLClient(faunadbEndpoint, {
  headers: {
    authorization: `Bearer ${faunaKey}`
  },
})

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
    const data = await graphQLClient.request(query)
    const subscriptions = data.allPushNotificationSubscriptions.data
    return subscriptions
  } catch (error) {
    console.error('error getting subs ', error)
    return []
  }
}

const sendPushMsg = async (subscription, message) => {
  try {
    await webpush.sendNotification(subscription, message)
    return true
  } catch (error) {
    console.error('Failed to send message to endpoint ', error)
    return false
  }
}


exports.handler = async (event) => {
  const method = event.httpMethod
  switch (method) {
    case 'POST':
      const subscriptions = await getAllSubscriptions()
      const promises = subscriptions.map( async (subscription) => {
        await sendPushMsg(subscription, event.body)
      })
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