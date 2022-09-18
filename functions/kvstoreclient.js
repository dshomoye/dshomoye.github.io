const fetch = require("node-fetch")

const KVstoreEndpoint = "https://kvstore.dmlas.workers.dev"
console.log("key ", process.env.PRESHARED_KEY)
const headers = {
  PRESHARED_KEY: process.env.PRESHARED_KEY,
}

const get = async (key) => {
  const r = await fetch(KVstoreEndpoint, {
    headers,
    method: "POST",
    body: JSON.stringify({
      op: "READ",
      key,
    }),
  })
  const res = await r.text()
  return res
}

const put = async (key, value) => {
  await fetch(KVstoreEndpoint, {
    headers,
    method: "POST",
    body: JSON.stringify({
      op: "WRITE",
      key,
      value,
    }),
  })
  return
}

const clear = async (key) => {
  await fetch(KVstoreEndpoint, {
    headers,
    method: "POST",
    body: JSON.stringify({
      op: "DELETE",
      key,
    }),
  })
  return
}

const list = async (prefix) => {
  const r = await fetch(KVstoreEndpoint, {
    headers,
    method: "POST",
    body: JSON.stringify({
      op: "LIST",
      prefix,
    }),
  })
  const res = await r.json()
  return res
}

exports.get = get
exports.put = put
exports.clear = clear
exports.list = list

