import React, { useState, useEffect } from "react"
import { notify } from "react-notify-toast"

import { subscriptionOptions } from "../utils/constants"

const subscriptionUrl = "/.netlify/functions/push-notification"

const saveSubscriptionToServer = async subscriptionEndpoint => {
  try {
    const saveResponse = await fetch(subscriptionUrl, {
      method: "POST",
      body: JSON.stringify({ endpoint: subscriptionEndpoint }),
    })
    if (saveResponse.status === 201) {
      return true
    }
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}

const removeSubscriptionFromServer = async subscriptionEndpoint => {
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
    console.log(error)
    return false
  }
}

const hasNotificationPermission = () => {
  if (Notification.permission === "granted") {
    return true
  } else if (Notification.permission !== "denied") {
    const permission = Notification.requestPermission()
    if (permission === "granted") {
      return true
    }
  }
  return false
}

const PushNotification = () => {
  const [subscribed, setSubscribed] = useState(false)
  const [working, setWorking] = useState(false)

  const pushSupported = () => {
    if (typeof window !== `undefined`) {
      if ("PushManager" in window) {
        return true
      }
    }
    return false
  }

  const createSubscription = async () => {
    const hasPermission = hasNotificationPermission()
    if (pushSupported() && hasPermission) {
      setWorking(true)
      navigator.serviceWorker.ready
        .then(async swRegistration => {
          const pushSubscription = await swRegistration.pushManager.subscribe(
            subscriptionOptions
          )
          console.log("subscription created ", pushSubscription)
          const subSaved = await saveSubscriptionToServer(
            pushSubscription.endpoint
          )
          if (subSaved) {
            setSubscribed(true)
            localStorage.setItem("PUSH_NOTIFICATION_SUBSCRIBED", "1")
            notify.show("Push subscription confirmed", "success")
          }
        })
        .catch(error => {
          console.log(error)
          notify.show(
            "An error occured setting up push notification",
            "warning"
          )
        })
    } else {
      notify.show("Notifications not allowed.", "error")
    }
    setWorking(false)
  }

  const unsubscribe = async () => {
    if (pushSupported() && subscribed) {
      setWorking(true)
      navigator.serviceWorker.ready
        .then(async swRegistration => {
          const subscription = await swRegistration.pushManager.getSubscription()
          await subscription.unsubscribe()
          removeSubscriptionFromServer(subscription.endpoint).then(() => {
            localStorage.setItem("PUSH_NOTIFICATION_SUBSCRIBED", "0")
            notify.show("Push notifications unsubscribed", "success")
          })
        })
        .catch(e => {
          console.log("unsub error ", e)
        })
      setSubscribed(false)
    }
    setWorking(false)
  }

  useEffect(() => {
    const push_sub = localStorage.getItem("PUSH_NOTIFICATION_SUBSCRIBED")
    if (push_sub === "1") {
      setSubscribed(true)
    }
  }, [])

  if (!pushSupported()) {
    return null
  }
  const btnText = subscribed
    ? "Unsubscribe from push notifications"
    : "Subscribe to push notifications"
  const callback = subscribed ? unsubscribe : createSubscription

  return (
    <button className="notification-btn" onClick={callback} disabled={working}>
      {btnText}
    </button>
  )
}

export default PushNotification
