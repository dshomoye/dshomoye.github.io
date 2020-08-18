import React, {useEffect} from "react"
import { graphql, navigate } from "gatsby"

import Layout from "../../components/layout"

//parse query param for site name
// get detail by site name or show not found

const SiteDetails = {
  google: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Elementum eu facilisis sed odio morbi quis. Nisi est sit amet facilisis magna. Porta lorem mollis aliquam ut porttitor leo. Ornare suspendisse sed nisi lacus sed. Eu tincidunt tortor aliquam nulla facilisi cras fermentum odio eu. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Aliquam faucibus purus in massa tempor nec feugiat nisl. Justo nec ultrices dui sapien eget. Mattis molestie a iaculis at erat pellentesque adipiscing commodo elit. Quis hendrerit dolor magna eget est lorem ipsum dolor. Sed viverra tellus in hac habitasse platea dictumst. Cras sed felis eget velit aliquet. Quisque egestas diam in arcu cursus euismod quis viverra. Purus sit amet luctus venenatis lectus magna. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Malesuada nunc vel risus commodo viverra maecenas accumsan lacus. Ac orci phasellus egestas tellus. Vitae tortor condimentum lacinia quis vel eros donec."
}

const Detail = ({data, location}) => {
  const { title } = data.site.siteMetadata
  const siteQuery = location.search.split("?site=")
  const siteName = siteQuery.length > 1 ? siteQuery[1] : null

  useEffect(() => {
    if(!siteName || !(siteName in SiteDetails)){
      navigate("/404")
    }
  },[siteName, SiteDetails])

  return (
    <Layout title={title} location={location}>
      <h1>{`${siteName} Policy Summary`}</h1>
      <p>{SiteDetails[siteName]}</p>
    </Layout>
  )
}

export default Detail;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`