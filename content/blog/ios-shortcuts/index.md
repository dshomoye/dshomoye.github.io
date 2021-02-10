---
title: It's time to take iOS shortcuts seriously.
date: 2021-01-03
description: iOS shortcuts are getting more powerful. I built one for Shazam to open Spotify.
bannerImage: shortcut-image.png
tags:
- technology
- life
gallerySources:
- caption: A daily automation to run a shortcut.
  src: media/ios-shortcuts/shortcut-schedule.png
  type: image
- caption: A shortcut to download a random image from Unsplash and set it as wallpaper.
  src: media/ios-shortcuts/unsplash-shortcut.png
  type: image

---
I recently wanted to Shazam a song and have it open in Spotify (the one true music streaming service) on my iPhone - but Siri and control center only allow Apple Music. It can only be done by downloading the Shazam app, configuring it to use Spotify, and then opening the app _every_ time to find a song - for it to go to Spotify. This mildly annoyed me because I know how easy it is to do this on Android. So I went out on a hunt for the easiest way to do this - **Shortcuts** [<sup>1</sup>](#references).

It turns out iOS has way more Shortcut actions than I remember - including one for Shazam. I tried to find a pre-made Shazam shortcut that opens Spotify but only found a very bloated and rather convoluted one - [Shazam++](https://routinehub.co/shortcut/4990/). So I decided to just build one myself. I’ve built shortcuts before and already know how the work.

The flow is fairly simple:

* Call the Shazam action which does its magic, identifies a song and returns the result.
* Use the result to open Spotify. Unfortunately, the result (from Shazam) returned is so tied to Apple ecosystem that it’s not possible to open Spotify directly from it (all the links and track info are Apple Music specific). So I had to find a way to get the Spotify link to the song given its Apple Music info. Luckily, there is a free API: [Songlink](https://www.notion.so/Public-API-d8093b1bb8874f8b85527d985c4f9e68), that does _literally_ that. I found out about the API while digging through the Shazam++ shortcut code:
  * Parse the json response (using the `Get dictionary from <>` action) from the song link api to get the Spotify link.
  * Open Spotify
  * ???
  * Profit.

What blew my mind here is finding out that Shortcuts on iOS can make arbitrary HTTP requests and parse the response (json and xml) into a key value dictionary that can be used later in any other action. That’s the core logic of a lot of applications. All without writing a line of code.

This made very excited for all the wild things I could experiment with.
So I also made a shortcut that lets me change the iOS wallpaper _without_ downloading image first. Which is a very annoying quirk with iOS for a very long time. This was legitimately one of my major qualms with iOS vs Android. I now have way to change it seamlessly.
What’s more, iOS also has “Automation” - so you can have actions run without any user action. I now have an automation to change my wallpaper on a schedule - _transparently_.  I don’t even think iOS apps have this capability yet - so this is kind of a way to do **more** than a “regular” app could, mind blowing.

I have the screenshot of the automation below and the equivalent shortcut that is run below.

<media-box src="media/ios-shortcuts/shortcut-schedule.png" name="A daily automation to run a shortcut." index=0></media-box>

<media-box src="media/ios-shortcuts/unsplash-shortcut.png" name="A shortcut to download a random image from Unsplash and set it as wallpaper." index=0></media-box>

The shortcut above is possibly one of the basic, out-of-reach capabilities I've been wanting/wasn't aware of:

* get data from an endpoint
* perform an action on the data, all without user input.

I can’t share an automation, but I **can** share shortcuts, the iCloud link to the Shazam+ (that’s the name I settled for) shortcut is [here](https://www.icloud.com/shortcuts/bb4b51e540184c298f9a9f8648cf904f). If you'd like to see the logic before downloading, here's a [screenshot](https://dshomoye.sirv.com/media/ios-shortcuts/shazam-logic.png).

The wallpaper (images downloaded from Unsplash) shortcut is [here](https://www.icloud.com/shortcuts/058ccf70203c40beb4e013bdb647efbc);

And there’s a more “interactive” one [here](https://www.icloud.com/shortcuts/9383a1f86ff0461b982bbb2118facb3b) that allows cycling through images before setting a preferred one.

These can be used as-is but are easy to customize, they’re intentionally kept simple.
Go forth and automate! 🦸🏾

I'm definitely going to be making using Shortcuts more.

This totally qualifies me as an iOS engineer, no? :)

***

## References

\[1\] "A shortcut is a quick way to get one or more tasks done with your apps". [Read the official Apple docs.](https://support.apple.com/guide/shortcuts/welcome/ios)