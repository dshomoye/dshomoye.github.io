export const bucketRoot = "https://dshomoye.nyc3.digitaloceanspaces.com"

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const subscriptionOptions = {
  userVisibleOnly: true,
  applicationServerKey:
    urlBase64ToUint8Array("BIzWFRNmUmy6ztKkoYNJOaDudQOrbhK5zHDmeCSDX6m3L5yVd5f6Bv3xMPf6A5Cf2-X4pPULKYjL7-ddmLRKcBA"),
}
