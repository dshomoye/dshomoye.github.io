const fs = require("fs")

const issueTitle = process.env.ISSUE_TITLE
const content = process.env.FILE_CONTENT

const siteNameRegex = /\[TO-PR\] \[(\w+)\]/

const match = issueTitle.match(siteNameRegex)
const siteName = match && match.length > 1 ? match[1] : null
if(content && siteName) {
  console.log(`Creating file with content ${siteName}.md`)
  fs.writeFileSync(`content/privacy-reports/${siteName}.md`, content)
  console.log('File Content:')
  console.log(fs.readFileSync(`content/privacy-reports/${siteName}.md`))
  console.log('DONE')
}
