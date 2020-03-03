const got = require("got")
const faunadbEndpoint = 'https://graphql.fauna.com/graphql'
const faunaKey = process.env.FAUNADB_KEY



const addSubscription = async (endpoint) => {
  const query = `mutation addSubscription {
        createPushNotificationSubscription(data: {
          endpoint: "${endpoint}"
        }) {
          _id
        }
      }`
  try {
    const res = await got(faunadbEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${faunaKey}`
      },
      body: JSON.stringify({query: query})
    })
    const resultData = JSON.parse(res.body)
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: resultData.data.createPushNotificationSubscription._id
      })
    }
  } catch (error) {
    console.error('error ', error)
    return {
      statusCode: 500,
      body: error
    }
  }

}

const removeSubscription = async (endpoint) => {
  const query = `mutation delSub {
    deletePushNotificationByEndpoint(endpoint: "${endpoint}"){
      count
    }
  }
  `
  try {
    await got(faunadbEndpoint, {
      body: query,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${faunaKey}`
      },
      body: JSON.stringify({query: query})
    })
    return {
      statusCode: 204
    }
  }catch(error){
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
    
}

exports.handler = async function(event) {
  console.log('received event ', event)
  const method = event.httpMethod
  const eventData = JSON.parse(event.body)
  switch (method) {
    case "POST":
      const response = await addSubscription(eventData.endpoint)
      return response
    case "DELETE":
      const response = await removeSubscription(eventData.endpoint)
      return response
    default:
      return {
        statusCode: 500,
        body: JSON.stringify(event),
      }
  }
}