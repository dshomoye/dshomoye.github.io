const { GraphQLClient } = require("graphql-request")

const faunadbEndpoint = "https://graphql.fauna.com/graphql"
const faunaKey = process.env.FAUNADB_KEY

const graphQLClient = new GraphQLClient(faunadbEndpoint, {
  headers: {
    authorization: `Bearer ${faunaKey}`,
  },
})

const addSubscription = async (endpoint, data) => {
  const query = `mutation addSubscription {
        createPushNotificationSubscription(data: {
          endpoint: "${endpoint}"
          subscriptionData: ${JSON.stringify(data)}
        }) {
          _id
        }
      }`
  try {
    const data = await graphQLClient.request(query)
    const id = data.createPushNotificationSubscription._id
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: id,
      }),
    }
  } catch (error) {
    console.error("error adding subsription: ", error)
    return {
      statusCode: 500,
      body: `${error}`,
    }
  }
}

const removeSubscription = async (endpoint) => {
  const query = `mutation delSub {
    deletePushNotificationByEndpoint(endpoint: "${endpoint}"){
      count
    }
  }`
  try {
    await graphQLClient.request(query)
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

exports.handler = async function (event) {
  const method = event.httpMethod
  switch (method) {
    case "POST":
      try {
        const eventData = JSON.parse(event.body)
        const { endpoint, data } = eventData
        const addResponse = await addSubscription(endpoint, data)
        console.log("New Subscription added for: ", endpoint)
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
