import rss from "@astrojs/rss"
import { site } from "../data/site.js"
import { getAllPosts, getPostUrl } from "../lib/posts.js"

export async function GET(context) {
  const posts = await getAllPosts()
  return rss({
    title: `${site.title} RSS`,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: getPostUrl(post),
    })),
  })
}
