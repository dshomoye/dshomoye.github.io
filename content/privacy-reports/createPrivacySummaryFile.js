const fs = require("fs")

const issueTitle = process.env.ISSUE_TITLE
const content = process.env.FILE_CONTENT

const siteNameRegex = /\[TO-PR\] \[(\w+)\]/

console.log(issueTitle)
console.log(content)

const match = issueTitle.match(siteNameRegex)
const siteName = match.length > 1 ? match[1] : null
if(content && siteName) {
  console.log(`Creating file with content ${siteName}.md`)
  fs.writeFileSync(`${siteName}.md`, content)
  console.log('DONE')
}
