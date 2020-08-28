const { Octokit } = require("@octokit/rest");


/**
 * @typedef Summary
 * @property {string} siteName
 * @property {string} reference
 * @property {string} summary
 * @property {Boolean} locationTracking
 * @property {Boolean} dataRetention
 * @property {Boolean} userControl
 * @property {Boolean} darkPatterns
 * @property {Boolean} crossSiteTracking
 */

/**
  * 
  * @param {Summary} data 
  */
const getSummaryMarkdown = data => {
  const capitalize = string =>  string.charAt(0).toUpperCase() + string.slice(1)
  
  return `
  ---
  name: ${capitalize(data.siteName)}
  ratings:
    locationTracking: ${data.locationTracking ? 1 : 0}
    dataRetention: ${data.dataRetention ? 1 : 0}
    userControl: ${data.userControl ? 1 : 0}
    darkPatterns: ${data.userControl ? 1 : 0}
    crossSiteTracking: ${data.crossSiteTracking ? 1 : 0}
  summary: "/privacy-report-card/details/${data.siteName}"
  reference: "${data.reference}"
  category: "privacy-report-detail"
  ---
  
  ## ${capitalize(data.siteName)}'s Privacy Policy - Summary
  
  ---
  ${data.summary}
  `
}

exports.handler = async event => {
  const requestData = JSON.parse(event.body)
  if(requestData['bot-field']){
    return {
      statusCode: 400,
      body: "Rejected bot submission."
    }
  }

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_ISSUE_TOKEN,
    });

    const createdIssue = await octokit.issues.create({
      title: `[TO-PR] Privacy Report Submission ${requestData.siteName}`,
      repo: "dshomoye.github.io",
      owner: "dshomoye",
      body: getSummaryMarkdown(requestData)
    })

    await octokit.issues.createComment({
      repo: "dshomoye.github.io",
      issue_number: createdIssue.data.number,
      owner: "dshomoye",
      body: `This issue was automatically created from an API call.`
    })

    return {
      statusCode: 200,
      body: "ok"
    }
  } catch(error) {
    console.error("An error occured creating issue", error)
    return {
      statusCode: 500,
      body: "Failed to create issue"
    }
  }
}
