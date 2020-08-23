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
  },
  {
    key: "locationTracking",
    title: "Location Tracking",
  },
  {
    key: "dataRetention",
    title: "Data Retentation",
  },
  {
    key: "userControl",
    title: "User Control",
  },
  {
    key: "darkPatterns",
    title: "Dark Patterns",
  },
  {
    key: "reference",
    title: "Policy Reference",
    linkKey: "reference",
    type: "link",
    linkText: "View ↗",
  },
]
