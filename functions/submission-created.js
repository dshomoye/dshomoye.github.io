const got = require("got")

exports.handler = async function(event) {
  const eventData = JSON.parse(event.body)
  try {
    const response = await got("https://api.sendinblue.com/v3/contacts", {
      json: { email: eventData.email },
      method: "POST",
      headers: {
        Accept: "application/json",
        "api-key": process.env.SENDINBLUE_API_KEY,
      },
    })
    return {
      statusCode: response.statusCode,
      body: "success",
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: event.body,
    }
  }
}
