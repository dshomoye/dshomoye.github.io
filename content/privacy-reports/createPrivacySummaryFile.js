const fs = require("fs")

const issueTitle = process.env.ISSUE_TITLE
const content = process.env.FILE_CONTENT

const siteNameRegex = /\[TO-PR\] \[(\w+)\]/
const siteName = issueTitle.match(siteNameRegex)[1]

console.log(issueTitle)
console.log(content)

if(content && siteName) {
  console.log(`Creating file with content ${siteName}.md`)
  fs.writeFileSync(`${siteName}.md`, content)
  console.log('DONE')
}
