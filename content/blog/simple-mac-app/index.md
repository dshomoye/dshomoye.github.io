---
title: "Bootstrapping a Simple Mac app is … not simple"
date: "2021-03-10"
description: "There is a lot of options for writing a Mac GUI app. I tested a few of them, this is a recap of how it went."
bannerImage: "pywebview.png"
tags:
  - "technology"
---

Last week I thought to myself that I would make a simple app that would: 
> Show me [Bear app](https://bear.app) notes that were created on the same day from previous years.

I needed this because I was consolidating my notes (Bear) and journal (Day One) into Bear. This is something Day One provides in the app. An "On This Day" and a Calendar view.
I wouldn’t need a custom tool but composite queries (x OR y OR z) aren’t possible in Bear, yet. I figured I can make multiple queries and combine them (x + y + z; Basic. This is all based on Apple’s inter-app communication protocol, [ `x-callback-url` ](http://x-callback-url.com).  Bear provides a bunch of callbacks, including one for search. I had an “API” to accomplish my goal. 

This a journal of my horrible, terrible, no-good experience of trying out (GUI) libraries to build the app. I brought the experience on myself, but I want to narrate what it was like.
Spoiler: I *didn’t* end up with an app. As with many things, the simplest solution, was the best one (the hardest part is *thinking of* a simple solution). [I made a script](TODO

# react-nodegui
The first thing I needed was a “good” library that will allow me to quickly build an app with a GUI. Electron is off the list for, a myriad of reasons; “its bloated”. Other than building a native app (with Swift) I had to search for other options. I stumbled upon [react/nodegui](https://github.com/nodegui/react-nodegui). It looked like a good alternative to electron, it (nodeGUI) renders with Qt5 and has css-like styling. I know React. I’ll be done in 10 minutes! 
After spending about 2 hours on it: I quickly realized the library is not “ready”. Not like `v0.99.99` “ready” but “not production level” ready wink, wink. No, it's "couldn’t get it to work with my simple app" ready. My biggest unsolved issue was with the “scroll” container (`ScrollArea`) that’s provided in the react library. I think if I spent another 2 - 5 hours in their docs and repo, and reading issues, I might run into an edge case that would make it work. Bu, importantly, I got no time for that. This has to be simple.

### SwiftUI
My disappointing experience with `react/nodegui`  led me to “build native”. If I’m going to hate electron, I should go with the most minimal run time possible. I went to the App Store and downloaded xCode. I wasn’t excited about this because I knew *everything* would be a tough. I had to learn to write Swift. But this wasn’t my biggest concern, learning the 5th...7th imperative (procedural?) language is not bad. What I dreaded was reading Apple’s documentation, *finding* documentation. The closest I’ve gotten to the ecosystem is trying to write iOS shortcuts and realizing how laughable the docs are. I knew this will involve a lot of trial and error, which will ironically take longer than sticking with react; but native! It took me about 2 hours to writing a basic app that renders the “note” UI I wanted. 

Once I “got” Swift UI — it was a bliss. It was like writing react, or svelte - declaration of views, and mapping to a state. Everything else gets taken care of. If you haven’t worked with a declarative UI library: I recommend it. It “makes sense”. 
Here’s an example of a grid layout with children that have styles (padding, spacing…) defined:

```swift
  LazyVGrid(
      columns: columns,
      alignment: .center,
      spacing: 16
  ) {
      Section(header: Text("Look Back").font(.title)) {
          ForEach(notes, id: \.self) { note in
              VStack {
                  Text("Note Title")
                      .font(.system(size: 20))
                      .bold()
                  Text(note)
              }
          }
          .padding(20)
          .background(Color.white)
          .cornerRadius(10)
          .shadow(radius: 2)
      }.padding(25)
  }
```

The hard part of the work is getting the bear notes in. In the  `react/nodegui` app, I used an external app [`xcall`](https://github.com/martinfinke/xcall) to make the x-callback calls and parse the result in node. But since this is a native app, x-callbacks are a native concept. I found a library that allows setting it up easy [CallbackURLKit](https://github.com/phimage/CallbackURLKit). Setting up a dependency is surprisingly easy in xCode (paste the link to the git repo and it auto magically adds it to the project). Unfortunately, using callbacks is where I hit a brick wall. x-callbacks are stateless, idempotent calls (in a way, they’re RESTFUL). What I needed was stateful. I couldn’t combine results from multiple calls because each time a new result is returned, the app receives it in a “clean state”. I might be wrong on my assessment but that's as far as I got. I had to abandon Swift UI because of this. 
> In hindsight, I could have tried to use `xcall` like I did with node. But for reason, that didn’t occur to me. I just really wanted a clean, native solution - so no compromises!


### pysimplegui
Swift and node have failed me, time for another one of my favorite languages - Python. I might have just googled “python easy UI library” and [`pySimpleGUI`](https://pysimplegui.readthedocs.io/en/latest/). I got what I asked for. This library is, fine I spent no more than 15 minutes with the docs and playing with the code to know - I don't think it's meant to be “modern looking”. A “pretty app” wasn’t part of my requirements, seeing something that *didn’t* look good certainly made me realize I had standards. 

### wxPython
I’ve seen wxWidget (C++) mentioned as a “good” library for writing desktop applications. I read through the python wrapper, [wxPython’s documentation](https://wxpython.org). I spent more time on this than I did with PySimpleGUI because the API is pretty extensive. I could *technically* create the (ok-looking) card views I was looking for. But unfortunately, like Swift, I didn’t quickly find easy-to-understand copy-pasteable code. Of all the complaints about JavaScript, finding good documentation and examples is not a problem. To me, it seemed the wxPython docs were written for someone familiar with wxWidgets and just wants to write them in Python. I might be wrong. But in my “get running as quickly as possible” mode, figuring out shadow, padding and border were more difficult than it should have been. SwiftUI was easier in this sense: what *feels* like the right way to do something is the right way to do it. 

### pywebview
I searched more on stumbled upon pywebview. I don’t quite remember the search query but I wish I had tried this first, I wouldn’t have bothered with the other python libraries. 
This is basically a fullstack app with a python backend and a web front end and bundled. No, this is not unique. But, this is different from all the javascript/Python libraries I (partially) tested. pywebview uses the system’s webview - yielding a much smaller bundle than an electron app which includes chrome for rendering. What quickly stood out to me is how easy it is to send data back and forth from javascript <-> python. 

Sending notes to the UI:
```python
class Api:
    def fullscreen(self):
        webview.windows[0].toggle_fullscreen()

    def ls(self):
        return os.listdir('.')
    
    def bear_notes_this_day(self):
        notes = notes_from_this_day(10)
        return notes

```

And how the notes are received in javascript:
```javascript
      window.pywebview?.api?.bear_notes_this_day()
        .then((result) => {
          console.log('python result: ',result)
          setNotes(result)
          setLoading(false)
        }).catch(() => {
          setLoading(false)
        })
```

This is admittedly more complicated than nodegui which is JavaScript all the way and doesn’t need an interop. But, this works! And the components are created worked. The UI is not trying to be like html. It is html. There is a [React starter](https://github.com/r0x0r/pywebview-react-boilerplate) that built on top of. I got the app I wanted in about an hour. I even took time to style it a bit: 

<media-box src="media/simple-mac-app/pywebview.png" name="Complete PyWebview App."></media-box>

This was the only app I took the time to generate a bundle for. It came out to 12MB - this is certainly better than Electron, a mini win. Unfortunately, the built app wouldn’t open. I don’t know what I did wrong. But at this point, I was done. I had REALLY had it. I’d spent too long on this. 
Later that day, I got a notification on my phone from Day One reminding of my journal entries from this day.

### Keeping it Simple
That notification from Day One made me feel like I had just wasted almost two days trying to use a WMD to win a knife fight. Couldn’t I just write something that will send a notification of notes from this day to my mac everyday? That's simpler than an app. So I did that. in 10 minutes. I wrote it in node because it was the one with the easiest, copy-paste, documented library [`node-notifier`](https://www.npmjs.com/package/node-notifier). 
The end result is this: 
```javascript
  for (let year = currentYear - 10; year < currentYear; year++) {
    const cmd = `xcall.app/Contents/MacOS/xcall -url "bear://x-callback-url/search?term=@cdate(${month}-${day}-${year})show_window=no"`;
    exec(cmd, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(error, stderr);
        return;
      }
      const notes = JSON.parse(JSON.parse(stdout).notes).map((n) => ({
        ...n,
        tags: JSON.parse(n.tags),
      }));
      notes.map((n) => {
        const truncTitle =
          n.title.length < 20 ? n.title : `${n.title.slice(0, 20)}...`;
        notifier.notify({
          title: `(Bear) On this day (${day}-${month}) in ${year}`,
          subtitle: `On ${n.creationDate}. Tags: ${n.tags.join(", ")}`,
          message: truncTitle,
          open: `bear://x-callback-url/open-note?id=${n.identifier}`,
          timeout: 24 * 60 * 60,
        });
      });
    });
  }

```

I then used automator to run the script every day. And then I get this every morning:

<media-box src="media/simple-mac-app/notification.png" name="Daily Notes in Notification Center."></media-box>

## In the End
There might not be much to learn from my particular unpleasant experience. I was pretty impatient. So, if you’re impatient and searching, maybe this will save you some (more?) time. 
But:
- If you’re building an app for Mac OS, use Swift (Swift UI). It’s really not hard to learn and I think it would genuinely be a joy to build with (on par with React). 
- If you don’t want to learn Swift or you *need* cross-platform and don't have the capacity to do native on all platform, then I think electron is the best bet; unless you’re willing to start and then run into random road blocks that will make the journey very painful. 
	There are other libraries that I also think should be passed:
	- [`webview/webview`](https://github.com/webview/webview) (really sparse on docs)
	-  Microsoft’s [`React Native`]( https://microsoft.github.io/react-native-windows/) - also sparse on docs, especially for MacOS. 
	None of these look like something you'd build any substantial with. Probably on the same level as [`Flutter`](https://flutter.dev/docs) for desktop which is also not ready for prime time.
	I do think the landscape is changing for desktop, and true cross-platform development. I think the ecosystem will be pretty exciting with more time when these libraries are mature. Something to look forward to.
	 