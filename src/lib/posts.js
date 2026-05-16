import { getCollection } from "astro:content"
import { existsSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

export const bucketRoot = "https://dshomoye.sirv.com"

export const getPostSlug = (post) => post.id.replace(/^\/+|\/+$/g, "")

export const getPostUrl = (post) => `/${getPostSlug(post)}/`

const hasMarkdownFiles = (directory) => {
  if (!existsSync(directory)) return false
  return readdirSync(directory).some((entry) => {
    const fullPath = path.join(directory, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) return hasMarkdownFiles(fullPath)
    return /\.(md|mdx)$/i.test(entry)
  })
}

export const getAllPosts = async () => {
  if (!hasMarkdownFiles(path.join(process.cwd(), "content", "blog"))) {
    return []
  }
  const posts = await getCollection("blog")
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export const getPostsByYear = (posts) =>
  posts.reduce((groups, post) => {
    const year = post.data.date.getUTCFullYear().toString()
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year).push(post)
    return groups
  }, new Map())

export const getAllTags = (posts) =>
  [...new Set(posts.flatMap((post) => post.data.tags || []))].sort((a, b) =>
    a.localeCompare(b)
  )

export const formatDate = (date, format = "long") => {
  if (format === "short") return date.toISOString().slice(0, 10)
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

export const resolveMediaUrl = (src = "") => {
  if (/^https?:\/\//.test(src) || src.startsWith("/")) return src
  return `${bucketRoot}/${src.replace(/^\/+/, "")}`
}
