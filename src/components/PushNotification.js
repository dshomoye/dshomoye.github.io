import React, { useState, useEffect } from "react"
import { notify } from "react-notify-toast"

import { subscriptionOptions } from "../utils/constants"

const subscriptionUrl = '/.netlify/functions/push-notification'

const pushSupported = () => {
  if (!('PushManager' in window) ) {
    // push notification isn't supported on this browser.
    console.log('push not supported')
    return false;
  }
  return true
}

const hasNotificationPermission = () => {
  if(Notification.permission === 'granted'){
    return true
  } else if(Notification.permission !== 'denied') {
    const permission = Notification.requestPermission()
    if(permission === 'granted'){
      return true
    }
  }
  //warn user here
  return false
}

const saveSubscriptionToServer = async (subscriptionEndpoint) => {
  try {
    const saveResponse = await fetch(subscriptionUrl, {
      method: 'POST',
      body: JSON.stringify({endpoint: subscriptionEndpoint})
    })
    if(saveResponse.status === 201){
      return true
    }
    return false
  }catch(error){
    console.log(error)
    return false
  }
}

const removeSubscriptionFromServer = async (subscriptionEndpoint) => {
  try {
    const delResponse = await fetch(subscriptionUrl, {
      method: 'DELETE',
      body: JSON.stringify({endpoint: subscriptionEndpoint})
    })
    if(delResponse.status === 204){
      return true
    }
    return false
  }catch(error){
    console.log(error)
    return false
  }
}


const PushNotification = () => {
  const [subscribed, setSubscribed] = useState(false)
  const [working, setWorking] = useState(false)

  const createSubscription = async () => {
    if(pushSupported() && hasNotificationPermission()){
      setWorking(true)
      navigator.serviceWorker.ready.then(async (swRegistration) => {
        const pushSubscription = await swRegistration.pushManager.subscribe(subscriptionOptions)
        console.log('subscription created ', pushSubscription)
        saveSubscriptionToServer(pushSubscription.endpoint)
        setSubscribed(true)
        localStorage.setItem('PUSH_NOTIFICATION_SUBSCRIBED', "1")
      }).catch((error) => {
        console.log(error)
        notify.show('An error occured setting up push notification', "warning")
      })
    } else {
      notify.show('Notifications not allowed.', "error")
    }
    setWorking(false)
  }
  
  const unsubscribe = () => {
    if(pushSupported() && subscribed) {
      setWorking(true)
      navigator.serviceWorker.ready.then(async (swRegistration) => {
        swRegistration.pushManager.getSubscription().then(function(subscription) {
          subscription.unsubscribe().then(function(successful) {
            removeSubscriptionFromServer(subscription.endpoint)
            localStorage.setItem('PUSH_NOTIFICATION_SUBSCRIBED', '0')
            setSubscribed(false)
            // You've successfully unsubscribed
          }).catch(function(e) {
            console.log('unsub error ',e )
            // Unsubscription failed
          })
        })  
      })
    }
    setWorking(false)
  }

  useEffect(() => {
    const push_sub = localStorage.getItem('PUSH_NOTIFICATION_SUBSCRIBED')
    if(push_sub === "1"){
      setSubscribed(true)
    }
  },[])
  

  if(!pushSupported()) {
    return null;
  }
  const btnText = subscribed ? 'Unsubscribe from push notifications' : 'Subscribe to push notifications'
  const callback = subscribed ? unsubscribe : createSubscription

  return (
  <button className="notification-btn" onClick={callback} disabled={working}>{btnText}</button>
  )
}

export default PushNotification
