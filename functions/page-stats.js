const { GraphQLClient } = require("graphql-request")

const hasuraEndpoint = "https://dshomoye.hasura.app/v1/graphql"
const hasuraAdminKey = process.env.HASURA_ADMIN_KEY

const client = new GraphQLClient(hasuraEndpoint, {
  headers: {
    "x-hasura-admin-secret": hasuraAdminKey,
  },
})

const getPageLikes = async (pathname, hostname) => {
  const query = `query MyQuery {
    page_stats(where: {pathname: {_eq: "${pathname}"}, hostname: {_eq: "${hostname}"}}) {
      hostname
      likes
      pathname
    }
  }`
  const data = await client.request(query)
  return data.page_stats
}

const addPage = async (pathname, hostname) => {
  const query = `mutation MyMutation {
    insert_page_stats(objects: {hostname: "${hostname}", pathname: "${pathname}"}) {
      returning {
        likes
      }
    }
  }`
  const res = await client.request(query)
  return res.insert_page_stats.returning
}

const updatePageLike = async (pathname, hostname, by = 1) => {
  const query = `mutation MyMutation {
    update_page_stats(where: {hostname: {_eq: "${hostname}"}, pathname: {_eq: "${pathname}"}}, _inc: {likes: ${by}}) {
      returning {
        likes
      }
    }
  }`
  const res = await client.request(query)
  return res.update_page_stats.returning
}

exports.handler = async event => {
  const eventData = JSON.parse(event.body)
  if (eventData.action === "get_likes") {
    const { pathname, hostname } = eventData.payload
    let res = await getPageLikes(pathname, hostname)
    if (res.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          likes: res[0].likes,
        }),
      }
    }
    res = await addPage(pathname, hostname)
    if (res.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(res[0]),
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
      body: JSON.stringify(res[0]),
    }
  }

  return {
    statusCode: 400,
    body: `{"error": "Unsupported action"}`,
  }
}
