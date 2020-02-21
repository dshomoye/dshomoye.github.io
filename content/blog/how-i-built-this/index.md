---
title: How I Built This
date: "2020-02-18"
description: "Take a look under the hood."
---

## How I built this blog (so far)
>  Warning, this is a tech/engineering post, so set your exptectations accordingly.

This site has been off to a *good* to start. Good enough for me, definitely not perfect. For the curious mind, rest easy, I am about divulge the secret recipe for this majestic project. Spoiler alert: I mainly cobbled together ****other**** people’s code and made it work for me. Of course, the real challenge is knowing what to use, and using it right. You can call it an art, I call it "*engineering*". This whole blog is a ****JAMstack**** (JavaScript, APIs, Markup). It’s lean and affords me to iterate (very) quickly. I can churn out blog posts so fast you’d think they were being made in China 🇨🇳!  Also, the “infrastructure” piece is actually about *not* having an infrastructure. It’s all… (pause for effect)… `serverless`  (get ready for buzzwords!). The site is all static. No need to maintin a “webserver” sending down data for each page load. If you want to know more, here’s a good explanation on the topic. [jamstack.wtf](~https://jamstack.wtf/~)⧉ 

### Gatsby
Getting right to it, the major piece of this puzzle is `Gatsby`.  This is a really popular static site generator that’s based on React. I think there’s others but this is so big there wasn’t much point checking others. This is an important factor when choosing frameworks because I (and really most devs) don’t want to have to write *everything* from scratch. Especially really common things that you’re guaranteed to need anywhere — like routing which gatsby handles automatically (and elegantly if I might add). The entire codebase is all on React 16, so no class components, for the most part. It’s all `hooks`!! And man, do I 💕 hooks. Declarative programming is a revolution! This isn’t the goal of this post so I won’t go into too much detail on React hooks and gatsby but the basics are:
- I write all posts in Markdown (the “markup” portion of “JAM”) and this is converted into html  by `gatsby-transformer-remark`
- I have some non-trivial logic with images and galleries that I put some work into making it clean and reusable (as best as I could). I’ll have a separate post on details of that but that is all based around  `useContext` hooks in React and *react-image-lightbox* package for the gallery. I use *rehype-react* so I can still use my complex image components *inside* my markdown files. If you know about `mdx` and wonder why I don’t use this. Well, for one, I didn’t even know about MDX when I started using *rehype-react*, and secondly mdx generates one page per markdown file so reusing gatsby logic would be a pain. Right now, I still only have a javascript file for generating all the blog pages. Also, the coupling between the image components that I have right now would just end up with me writing really messy `*.mdx` files. I do not want that, at all. One of my main focus of design was to make sure all of my posts remain in markdown. There’s a lot of benefits but one of the big ones is that I can write on the go. I can write markdown on my phone, but **definitely** not JavaScript. There’s still some pretty important plugins that make things all nice and pretty but they’re mostly plug and play. Everything I use is in my `package.json` file and you’re free to [check it out](~https://github.com/dshomoye/dshomoye.github.io/blob/gatsby/package.json~)⧉

### Media (Digital Ocean)
My first iteration of this blog had images right next the markdown files. But, I knew I would be adding videos. And even though I’m “*only*” using an iPhone for photography. The file sizes are still in the megabytes. I *could* compress but I want to the readers to get something a little higher quality than from a regular site. Especially since part of the point of this is a showcase of my experiences. I do not want to compress those experiences. Now, as a good web citizen, I do run *lossless* compression on the images and also make them progressive with a mac app called `imagemagick`. It has a handy command (`mogrify`) that I just run on an image directory to get these optimized images. There’s probably some way to further reduce the files sizes but this isn’t really where I want to dedicate research time so I’ll stick with this but I’m open to improving. In order to graduate from images in the repo which is bad for several reasons but also just a problem because Github flags repos larger than 1Gb (a trivial limit to hit with media). I decided to use Digital Ocean `spaces`. It’s the cheapest blob storage solution I’ve found and is pretty comparable to AWS S3 feature-wise. There really aren’t a lot of options for free storage (another main goal of this project was to not run a huge bill).  The UI is nice enough. And best part, the API is S3-compliant so aws-sdk usage is perfectl fine and I haven’t even had to use this yet. I just use an S3 app called Cyberduck for managing my bucket.

### Github Pages
As you may have deducted, the actual code (and “server” for all intents and purposes) is on Github. This is pretty self explanatory. Code must go somewhere. And these days **git** is just analogous for *Github*.  If you are unfamiliar with Github pages (how the static files are sent whenever you go to this site in the browser) — the homepage includes an explanatory video. [pages.github.com](~https://pages.github.com/~)⧉ 

### Google domains
This barely counts as an implementation detail since a domain provider almost never matters when deciding an infrastructure. I did want to call out that the sweet looking `.dev` TLD (top-level domain) in my site link is because Google started handing these out. It’s one of the few domains that has am HTTPS requirement (which makes it... cool[er] -- maybe? 🤷🏾‍♂️).

### Send In Blue
This is my email marketing service. After some light research, it was the best I could find that had some inclination of respecting user’s privacy. If it’s not obvious already, that’s something I don’t take trivially. They’re even based in France so they *really* have to care about GDPR. There’s a bit of manual process of validating the account before you can start an email campaign, 

### Ticksel
I wanted *some form* of analytics on the pages/posts but didn’t want to use any tracking cookies (👀 at you Google analytics). Ticksel is one of the very few sites that offers this, and for free. 

That all just about covers everything I’ve done so far. I’ll keep this updated when things change (and they certainly will).

