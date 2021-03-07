self.addEventListener("push", (event) => {
  const notifcationOptions = { title: "Damola's Blog" }
  if (event.data) {
    notifcationOptions.message = event.data.text()
    try {
      const notificationData = event.data.json()
      notifcationOptions.title = notificationData.title
      notifcationOptions.message = notificationData.message
    } catch (error) {
      console.error("Error processing notification data", error)
    }
  }
  event.waitUntil(
    self.registration.showNotification(notifcationOptions.title, {
      body: notifcationOptions.message
        ? notifcationOptions.message
        : "Site Update",
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = "https://dshomoye.dev"
  clients.openWindow(url)
})
