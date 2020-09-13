export const isClient = typeof window !== "undefined"

export const encodeFormData = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

export const getImageSourceSet = src => `${src}?w=900 300w,
  ${src}?w=1200 600w,
  ${src} 900w
  `
