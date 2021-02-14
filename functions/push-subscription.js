const { GraphQLClient } = require("graphql-request")
const { pushToSubscription } = require("./push-notification")

const hasuraEndpoint = "https://dshomoye.hasura.app/v1/graphql"
const hasuraAdminKey = process.env.HASURA_ADMIN_KEY

const client = new GraphQLClient(hasuraEndpoint, {
  headers: {
    "x-hasura-admin-secret": hasuraAdminKey,
  },
})

const addSubscription = async (subscription) => {
  const query =  `mutation MyMutation($endpoint: String, $subscription: jsonb) {
    insert_push_subscriptions_one(object: {endpoint: $endpoint, subscription: $subscription}) {
      endpoint
      created_at
      subscription
      updated_at
    }
  }`
  const variables = {
    endpoint: subscription.endpoint,
    subscription
  }
  try {
    const {status, errors} = await client.rawRequest(query, variables)
    console.log('status, error ', status, errors)
    if(status >= 300) {
      throw new Error(`Failed to add subscription: ${errors.toString()}`)
    }
    const welcomeMsg = JSON.stringify({
      title: "Awesome!",
      message: "Push Notifications are now enabled.",
    })
    const sent = await pushToSubscription(JSON.parse(subscription), welcomeMsg)
    return {
      statusCode: 201,
      body: JSON.stringify({
        sent,
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

const removeSubscription = async endpoint => {
  const query = `mutation MyMutation {
    delete_push_subscriptions_by_pk(endpoint: "${endpoint}") {
      updated_at
    }
  }`
  try {
    await client.request(query)
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
  switch (method) {
    case "POST":
      try {
        const addResponse = await addSubscription(JSON.parse(event.body))
        console.log("New Subscription handled.")
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
