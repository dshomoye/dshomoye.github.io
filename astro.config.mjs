import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkSmartypants from "remark-smartypants"

export default defineConfig({
  site: "https://www.dshomoye.dev",
  publicDir: "./static",
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-light",
    },
    remarkPlugins: [remarkSmartypants],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["heading-anchor"],
          },
        },
      ],
    ],
  },
})
