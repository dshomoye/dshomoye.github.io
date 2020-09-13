const fs = require("fs")
const issueTitle = process.env.ISSUE_TITLE
const content = process.env.FILE_CONTENT
const siteNameRegex = /\[TO-PR\] \[(\w+)\]/
const match = issueTitle.match(siteNameRegex)
const siteName = match && match.length > 1 ? match[1] : null

if(content && siteName) {
  console.log(`Creating file with content ${siteName}.md`)
  fs.writeFileSync(`content/privacy-reports/${siteName}.md`, content)
  console.log('DONE')
  console.log(`::set-output name=BRANCH_NAME::${siteName}`)
} else {
  throw new Error('Cannot create summary file from issue')
}
