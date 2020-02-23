exports.handler = function(event, context, callback) {
  // your server-side functionality
  console.log('event', event)
  console.log('ctx', context)
  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
}