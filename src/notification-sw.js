self.addEventListener("push", (event) => {
  const notifcationOptions = {}
  if (event.data) {
    const notificationData = event.data.json()
    notifcationOptions.title = notificationData.title
    notifcationOptions.body = notificationData.message
      ? notificationData.message
      : `Site Update!`
  } else {
    notifcationOptions.title = "Site update!"
  }
  event.waitUntil(
    self.registration.showNotification(notifcationOptions.title, {
      body: notifcationOptions.body,
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = "https://dshomoye.dev"
  clients.openWindow(url)
})
