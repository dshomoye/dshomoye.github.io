export const bucketRoot = "https://dshomoye.nyc3.digitaloceanspaces.com"

export const PrivacyReportTableColumns = [
  {
    key: "name",
    title: "Service Summary",
    frozen: true,
    linkKey: "summary",
    type: "link",
  },
  {
    key: "crossSiteTracking",
    title: "Cross Site Tracking",
    isRating: true,
  },
  {
    key: "locationTracking",
    title: "Location Tracking",
    isRating: true,
  },
  {
    key: "dataRetention",
    title: "Data Retentation",
    isRating: true,
  },
  {
    key: "userControl",
    title: "User Control",
    isRating: true,
  },
  {
    key: "darkPatterns",
    title: "Dark Patterns",
    isRating: true,
  },
  {
    key: "reference",
    title: "Policy Reference",
    linkKey: "reference",
    type: "link",
    linkText: "View ↗",
  },
]
