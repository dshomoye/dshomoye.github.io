import React, { useState, useEffect, PureComponent } from "react"

import { subscriptionOptions } from "../utils/constants"

const pushSupported = () => {
  if (!('PushManager' in window) ) {
    // push notification isn't supported on this browser.
    return false;
  }
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

const saveSubscriptionToServer = (subscriptionEndpoint) => {

}


const PushNotification = () => {
  const [subscribed, setSubscribed] = useState(false)
  const [working, setWorking] = useState(false)

  const createSubscription = async () => {
    if(hasNotificationPermission()){
      setWorking(true)
      navigator.serviceWorker.ready.then(async (swRegistration) => {
        const pushSubscription = await swRegistration.pushManager.subscribe(subscriptionOptions)
        saveSubscriptionToServer(pushSubscription.endpoint)
      }).catch((error) => {
        console.error(error)
        //warn about error
      })
    }
  }
  
  const unsubscribe = () => {

  }

  useEffect(() => {
    const push_id = localStorage.getItem('PUSH_NOTIFICATION_ID')
    if(push_id){
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
