const { get, put } = require("./kvstoreclient")

const buildKey = (pathname, hostname) =>
  `dshomoye.dev:page_stats:likes:${hostname}:${pathname}`

const getPageLikes = async (pathname, hostname) => {
  const res = await get(buildKey(pathname, hostname))
  return res
}

const updatePageLike = async (pathname, hostname, by = 1) => {
  const current = await getPageLikes(pathname, hostname)
  if (!current) {
    const nextVal = by > 0 ? by : 0;
    console.log('updating page, current is ', nextVal)
    await put(buildKey(pathname, hostname), nextVal)
    return nextVal
  } else {
    let count = parseInt(current)
    count += by
    await put(buildKey(pathname, hostname), count)
    return count
  }
}

exports.handler = async (event) => {
  if (event.httpMethod != "POST") {
    return {
      statusCode: 404,
      body: `{"error": "Not Found"}`,
    }
  }
  const eventData = JSON.parse(event.body)
  if (eventData.action === "get_likes") {
    const { pathname, hostname } = eventData.payload
    let res = await getPageLikes(pathname, hostname)
    if (!res) {
      return {
        statusCode: 200,
        body: JSON.stringify({ likes: 0 }),
      }
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ likes: res }),
      }
    }
  } else if (
    eventData.action === "add_like" ||
    eventData.action === "remove_like"
  ) {
    const { pathname, hostname } = eventData.payload
    let res = await updatePageLike(
      pathname,
      hostname,
      eventData.action === "remove_like" ? -1 : 1
    )
    return {
      statusCode: 200,
      body: JSON.stringify({ likes: res }),
    }
  }

  return {
    statusCode: 400,
    body: `{"error": "Unsupported action"}`,
  }
}
