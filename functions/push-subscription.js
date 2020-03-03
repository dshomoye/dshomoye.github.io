const got = require("got")
const faunadbEndpoint = "https://graphql.fauna.com/graphql"
const faunaKey = process.env.FAUNADB_KEY
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${faunaKey}`,
}

const addSubscription = async endpoint => {
  const query = `mutation addSubscription {
        createPushNotificationSubscription(data: {
          endpoint: "${endpoint}"
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
      body: query,
      method: "DELETE",
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

const getAllSubscriptions = async () => {}

exports.handler = async function(event) {
  console.log("received event ", event)
  const method = event.httpMethod
  const eventData = JSON.parse(event.body)
  switch (method) {
    case "POST":
      const addResponse = await addSubscription(eventData.endpoint)
      return addResponse
    case "DELETE":
      const delResponse = await removeSubscription(eventData.endpoint)
      return delResponse
    default:
      return {
        statusCode: 500,
        body: JSON.stringify(event),
      }
  }
}
