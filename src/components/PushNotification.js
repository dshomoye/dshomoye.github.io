import React, { useState, useEffect } from "react"
import { notify } from "react-notify-toast"

const subscriptionUrl = "/.netlify/functions/push-subscription"

const saveSubscriptionToServer = async (subscription) => {
  try {
    const saveResponse = await fetch(subscriptionUrl, {
      method: "POST",
      body: JSON.stringify(subscription),
    })
    if (saveResponse.status === 201) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

const removeSubscriptionFromServer = async (subscriptionEndpoint) => {
  try {
    const delResponse = await fetch(subscriptionUrl, {
      method: "DELETE",
      body: JSON.stringify({ endpoint: subscriptionEndpoint }),
    })
    if (delResponse.status === 204) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

const hasNotificationPermission = async () => {
  if (Notification.permission === "granted") {
    return true
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      return true
    }
  }
  return false
}

const pushSupported = () => {
  if (typeof window !== `undefined`) {
    if ("PushManager" in window) {
      return true
    }
  }
  return false
}

const PushNotification = () => {
  const [subscribed, setSubscribed] = useState(false)
  const [working, setWorking] = useState(false)

  const createSubscription = async () => {
    notify.hide()
    const hasPermission = await hasNotificationPermission()
    if (pushSupported() && "serviceWorker" in navigator && hasPermission) {
      const urlBase64ToUint8Array = (base64String) => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
        const base64 = (base64String + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/")

        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
      }
      navigator.serviceWorker.ready
      .then(async (swRegistration) => {
          setWorking(true)
          const pushSubscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              "BIzWFRNmUmy6ztKkoYNJOaDudQOrbhK5zHDmeCSDX6m3L5yVd5f6Bv3xMPf6A5Cf2-X4pPULKYjL7-ddmLRKcBA"
            ),
          })
          const subSaved = await saveSubscriptionToServer(pushSubscription)
          if (subSaved) {
            setSubscribed(true)
            localStorage.setItem("PUSH_NOTIFICATION_SUBSCRIBED", "1")
            notify.show("Push subscription confirmed", "success")
            setWorking(false)
          } else {
            notify.show("An eror occured", "error")
            setWorking(false)
          }
        })
        .catch((error) => {
          console.log(error)
          notify.show(
            "An error occured setting up push notification",
            "warning"
          )
          setWorking(false)
        }).finally(() => setWorking(false))
    } else {
      notify.show("Notifications not allowed.", "error")
    }
  }

  const unsubscribe = async () => {
    notify.hide()
    if (pushSupported() && subscribed) {
      setWorking(true)
      navigator.serviceWorker.ready
        .then(async (swRegistration) => {
          const subscription = await swRegistration.pushManager.getSubscription()
          await subscription.unsubscribe()
          removeSubscriptionFromServer(subscription.endpoint).then(() => {
            localStorage.setItem("PUSH_NOTIFICATION_SUBSCRIBED", "0")
            notify.show("Push notifications disabled", "success")
            setWorking(false)
          })
        })
        .catch((e) => {
          setWorking(false)
        })
      setSubscribed(false)
    }
  }

  useEffect(() => {
    const push_sub = localStorage.getItem("PUSH_NOTIFICATION_SUBSCRIBED")
    if (push_sub === "1") {
      setSubscribed(true)
    }
  }, [])

  useEffect(() => {
    //always update sw
    if (pushSupported() && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((swRegistration) =>
        swRegistration.update()
      )
    }
  }, [])

  if (!pushSupported()) {
    return null
  }
  let btnText = subscribed
    ? "Unsubscribe from push notifications"
    : "Enable push notifications"
  btnText = working ? "busy..." : btnText
  const callback = subscribed ? unsubscribe : createSubscription

  return (
    <button
      className="notification-btn"
      onClick={callback}
      disabled={working}
      tabIndex={0}
    >
      {btnText}
    </button>
  )
}

export default PushNotification
