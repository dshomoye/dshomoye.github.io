import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const gallerySource = z.object({
  caption: z.string().optional(),
  src: z.string(),
  type: z.enum(["image", "video"]).default("image"),
})

const blog = defineCollection({
  loader: glob({
    base: "./content",
    pattern: "blog/**/*.(md|mdx)",
    generateId: ({ entry }) =>
      entry
        .replace(/^blog\//, "")
        .replace(/\/index\.(md|mdx)$/i, "")
        .replace(/\.(md|mdx)$/i, ""),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
    bannerImage: z.string().optional(),
    gallerySources: z.array(gallerySource).optional().default([]),
    lastUpdated: z.coerce.date().optional(),
  }),
})

export const collections = { blog }
