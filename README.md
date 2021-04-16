## My Gatsby powered blog.

[![Netlify Status](https://api.netlify.com/api/v1/badges/428bfc02-50ae-4481-adf2-50765cddb5f6/deploy-status)](https://app.netlify.com/sites/dshomoye/deploys)
![Gatsby GH Pages Publish](https://github.com/dshomoye/dshomoye.github.io/workflows/Gatsby%20GH%20Pages%20Publish/badge.svg)

[Live version](https://dshomoye.dev), running `gatsby` branch.

## Development
Must have `gatsby-cli` installed to run the package scripts

- `npm install -g gatsby-cl` (or use `npx`)

- `npm install` from root

- `npm run develop` to start a dev server.

The actual blog posts are in a different repo (referenced as a submodule in the `content` directory). 


#### [Implementing Push Notifications](https://dshomoye.dev/gatsby-web-push-notifications)

If trying to implement push notifications, the relevant files are:
- [`/src/components/PushNotification.js`](/src/components/PushNotification.js) - React component 
- [`appendScript`](/gatsby-config.js#L88) option in `gatsby-plugin-offline`
- [`src/notification-sw.js`](src/notification-sw.js) - service worker
- [`functions/push-notification.js`](functions/push-notification.js) - serverless function (aws lambda etc)
- [`functions/push-subscription.js`](functions/push-subscription.js)- serverless function
