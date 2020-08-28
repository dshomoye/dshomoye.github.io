const got = require("got")

exports.handler = async event => {
  const requestData = JSON.parse(event.body)
  if(requestData['bot-field']){
    return {
      statusCode: 400,
      body: "Rejected bot submission."
    }
  }
  return {
    statusCode: 200,
    body: "ok"
  }
}
