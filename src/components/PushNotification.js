import React, { useState, useEffect } from "react"
import { notify } from "react-notify-toast"

import { subscriptionOptions } from "../utils/constants"

const subscriptionUrl = "/.netlify/functions/push-subscription"

const saveSubscriptionToServer = async subscription => {
  const body = JSON.stringify({
    endpoint: subscription.endpoint,
    data: JSON.stringify(subscription),
  })
  try {
    const saveResponse = await fetch(subscriptionUrl, {
      method: "POST",
      body: body,
    })
    if (saveResponse.status === 201) {
      return true
    }
    return false
  } catch (error) {
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
    notify.hide()
    const hasPermission = await hasNotificationPermission()
    if (pushSupported() && hasPermission) {
      setWorking(true)
      navigator.serviceWorker.ready
        .then(async swRegistration => {
          const pushSubscription = await swRegistration.pushManager.subscribe(
            subscriptionOptions
          )
          const subSaved = await saveSubscriptionToServer(pushSubscription)
          if (subSaved) {
            setSubscribed(true)
            localStorage.setItem("PUSH_NOTIFICATION_SUBSCRIBED", "1")
            notify.show("Push subscription confirmed", "success")
          } else {
            notify.show("An eror occured", "error")
          }
        })
        .catch(() => {
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
    notify.hide()
    if (pushSupported() && subscribed) {
      setWorking(true)
      navigator.serviceWorker.ready
        .then(async swRegistration => {
          const subscription = await swRegistration.pushManager.getSubscription()
          await subscription.unsubscribe()
          removeSubscriptionFromServer(subscription.endpoint).then(() => {
            localStorage.setItem("PUSH_NOTIFICATION_SUBSCRIBED", "0")
            notify.show("Push notifications disabled", "success")
          })
        })
        .catch((e) => {
          //NOOP
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
    : "Enable push notifications"
  const callback = subscribed ? unsubscribe : createSubscription

  return (
    <button className="notification-btn" onClick={callback} disabled={working}>
      {btnText}
    </button>
  )
}

export default PushNotification
