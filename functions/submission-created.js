const got = require("got")

exports.handler = async function(event) {
  console.log('submission event: ')
  console.log(event)
  const eventData = JSON.parse(event.body)
  try {
    const response = await got("https://api.sendinblue.com/v3/contacts", {
      json: {
        email: eventData.payload.email,
        listIds: [2],
        updateEnabled: true,
      },
      method: "POST",
      headers: {
        "api-key": process.env.SENDINBLUE_API_KEY,
        "content-type": "application/json",
      },
    })
    return {
      statusCode: response.statusCode,
      body: "success",
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: `${error} data: ${JSON.stringify(eventData)}`,
    }
  }
}
