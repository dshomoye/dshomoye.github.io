---
title: How I Built This
date: 2020-02-18
description: Take a look under the hood.
bannerImage: media/how-i-built-this/unsplash_mac_w_code.jpg
lastUpdated: 2021-02-06T19:00:00Z
tags:
- technology

---
### Editting (forestry.io)

As much as I like the convenience of writing posts in markdown, I wanted a more... seamless authoring experience. I considered running a headless content management system (CMS) so I can have a better editing UI (instead of using VSCode's editor). But I searched and stumbled upon [forestry.io](https://forestry.io). It was the perfect mix I was looking for: a nice WYSIWYG editor with a "raw" markdown mode too - so I can still create my custom elements. The best part is that it integrates with `gatsby`. So I get a preview url while editing. And once I'm done , I just have to hit "Save" and it commits to github which triggers my netlify build and publishes my changes. This means, I can write, preview and publish from any web browser, yes even an iPad. I'm very satisfied with this setup - unless something better (somehow?) comes along.

### Hosting (Netlify)

I have now moved this site to Netlify. I do still have a running version on Githb pages but moving to Netlify was inevitable. My main motivation is that I badly wanted to replace the iframe I was using for the newsletter sign up. An `iframe` is just... basically an abonimation. It felt out of place. The new [page](/newsletter) is much better. I wrote the form myself. And the submission is where Netlify comes. I still needed to automate sending signups to my marketing platform (SendInBlue). So, I used Netlify functions! These are basically, lambda functions, that are _even easier_ to set up. The function gets triggered per submission and the details gets sent to SendInBlue via their API. I'm more satisfied with the set up.
This is what the function looks like:

```js
const got = require("got")

exports.handler = async function(event) {
  const eventData = JSON.parse(event.body)
  try {
    const response = await got("https://api.sendinblue.com/v3/contacts", {
      json: {
        email: eventData.payload.email,
        listIds: [2],
        updateEnabled: true,
      },
      method: "POST",
      headers: {
        "api-key": process.env.SENDINBLUE_API_KEY,
        "content-type": "application/json",
      },
    })
    return {
      statusCode: response.statusCode,
      body: "success",
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: `${error} data: ${JSON.stringify(eventData)}`,
    }
  }
}
// the critical part of this is the api key
// it's being set in the Netlify function environment variable.
// This is just imposibble with a static site not without hardcording
```

***

Another added benefit is having more control over the headers of the files, I was getting dinged in chrome lighthouse for having low TTL on the static files. Github doesn't allow changing this but Netlify does. Also, Netlify has way better CDN. So things should be even more blazingly fast!

***

> Warning, this is a tech/engineering post, so set your exptectations accordingly.

This site has been off to a _good_ to start. Definitely not perfect, but good enough for me. For the curious mind, rest easy, I am about divulge the secret recipe for this majestic project. Spoiler alert: I mainly cobbled together **other** people’s code and made it work for me. Of course, the real challenge is knowing what to use, and using it right. You can call it an art, I call it "_engineering_". This whole blog is a **JAMstack** (JavaScript, APIs, Markup). It’s lean and affords me to iterate (very) quickly. I can churn out blog posts so fast you’d think they were being made in China 🇨🇳! Also, the “infrastructure” piece is actually about _not_ having an infrastructure. It’s all… (pause for effect)… `serverless` (get ready for buzzwords!). The site is all static. No need to maintain a “web server” sending down data for each page load. If you want to know more, here’s a good explanation on the topic. [jamstack.wtf](https://jamstack.wtf/)⧉

### Gatsby

Getting right to it, the major piece of this puzzle is `Gatsby`. This is a really popular static site generator that’s based on React. I think there’s others but this is so big there wasn’t much point checking others. This is an important factor when choosing frameworks because I (and really most devs) don’t want to have to write _everything_ from scratch. Especially really common things that you’re guaranteed to need anywhere — like routing which gatsby handles automatically (and elegantly if I might add). The entire codebase is all on React 16, so no class components, for the most part. It’s all `hooks`!! And man, do I 💕 hooks. Declarative programming is a revolution! This isn’t the goal of this post so I won’t go into too much detail on React hooks and gatsby but the basics are:

* I write all posts in Markdown (the “markup” portion of “JAM”) and this is converted into html by `gatsby-transformer-remark`
* I have some non-trivial logic with images and galleries that I put some work into making it clean and reusable (as best as I could). It is all based around `useContext` and `useReducer` hooks in React and _react-image-lightbox_ package for the gallery. I use _rehype-react_ so I can still use my complex image components _inside_ my markdown files. If you know about `mdx` and wonder why I don’t use this. Well, for one, I didn’t even know about MDX when I started using _rehype-react_, and secondly mdx generates one page per markdown file so reusing gatsby logic would be a pain. Right now, I still only have a javascript file for generating all the blog pages. Also, the coupling between the image components that I have right now would just end up with me writing really messy `*.mdx` files. I do not want that, at all. One of my main focus of design was to make sure all of my posts remain in markdown. There’s a lot of benefits but one of the big ones is that I can write on the go. I can write markdown on my phone, but **definitely** not JavaScript. There’s still some pretty important plugins that make things all nice and pretty but they’re mostly plug and play. Everything I use is in my `package.json` file and you’re free to [check it out](https://github.com/dshomoye/dshomoye.github.io/blob/gatsby/package.json)⧉

### Media (Sirv)

I have moved out of Digital Ocean. I primarily have more words than pictures (although, maybe I could save more time by reversing that?). Anyway, digital ocean spaces aren't free. And for a side project whose main value to me, is something to tinker with, I didn't quite like paying for the digital ocean space. It was up to 50Gb, and I just don't need it. Sirv is limited to 500MB on the free plan, but that will suffice for, well, very long. I will gladly support a good service (in fact, its taken me this long to leave the server because I liked supporting them). My main motivation, was actually not the cost, it was because I really wanted to serve progressive images to devices based on screen sizes. [Sirv](sirv.com) does this for you, all with just a query parameter on the url to the image! Being free, was just the icing on top. It took me 15 minutes, to migrate all media and just update the root url for all media. I'm happier now. I don't have to bother with any local optimizations. Creating images of 240, 600, 1200px just doesn't sound very fun. It's all server-side. Its the kind of plug-and-play I like to see. Lets me focus on what matters to me.

### Github Pages

This is less relevant. The site is primarily on Netlify, but there is a seconday version on pages, contigency and what-not.

### Google domains

This barely counts as an implementation detail since a domain provider almost never matters when deciding an infrastructure. I did want to call out that the sweet looking `.dev` TLD (top-level domain) in my site link is because Google started handing these out. It’s one of the few domains that has an HTTPS requirement (which makes it... cool\[er\] -- maybe? 🤷🏾‍♂️).

### Send In Blue

This is my email marketing service. After some light research, it was the best I could find that had some inclination of respecting user’s privacy. If it’s not obvious already, that’s something I don’t take trivially. They’re even based in France so they _really_ have to care about GDPR. There’s a bit of manual process of validating the account before you can start an email campaign,

***

**Update: 03-21**:
I have decided to remove ticksel analytics from my site. Even though it's a privacy respecting service, ad blockers still consider it a tracking pixel (and technically speaking, it _is_), so I figured I wasn't getting much value out of it. I might resort to setting up my own basic analytics sytem just to have an idea of usage but this site will be 100% tracking free. Huzzah! 😁

~~### Ticksel~~

### Goatcounter

I use goatcounter, an even leaner alternative to `Ticksel`. I really don't **need** analytics here. But, getting hit count, is kind of nice, making it easy to know what might need to be updated. I _love_ [goatcounter](goatcounter.com), and, it thankfully doesn't get blocked by adblockers; unlike Ticksel, which even though was simple, it evidently wasn't simple enough.