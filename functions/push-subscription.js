const got = require("got")
const faunadbEndpoint = "https://graphql.fauna.com/graphql"
const faunaKey = process.env.FAUNADB_KEY
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${faunaKey}`,
}

const addSubscription = async (endpoint, data) => {
  const query = `mutation addSubscription {
        createPushNotificationSubscription(data: {
          endpoint: "${endpoint}"
          subscriptionData: ${data}
        }) {
          _id
        }
      }`
  try {
    const res = await got(faunadbEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query: query }),
    })
    const resultData = JSON.parse(res.body)
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: resultData.data.createPushNotificationSubscription._id,
      }),
    }
  } catch (error) {
    console.error("error adding subsription: ", error)
    return {
      statusCode: 500,
      body: error,
    }
  }
}

const removeSubscription = async endpoint => {
  const query = `mutation delSub {
    deletePushNotificationByEndpoint(endpoint: "${endpoint}"){
      count
    }
  }
  `
  try {
    await got(faunadbEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query: query }),
    })
    return {
      statusCode: 204,
    }
  } catch (error) {
    console.error("error deleting subscripton ", error)
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}

exports.handler = async function(event) {
  const method = event.httpMethod
  const eventData = JSON.parse(event.body)
  switch (method) {
    case "POST":
      const addResponse = await addSubscription(eventData.endpoint, eventData.data)
      return addResponse
    case "DELETE":
      const delResponse = await removeSubscription(eventData.endpoint)
      return delResponse
    default:
      return {
        statusCode: 400,
        body: "Invalid request",
      }
  }
}
