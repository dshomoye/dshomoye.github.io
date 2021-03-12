---
title: "Bootstrapping a simple Mac app can be hard."
date: "2021-03-11"
description: "There is a lot of options for writing a Mac GUI app. I tested a few of them, this is a recap of how it went."
bannerImage: "finder.png"
tags:
  - "technology"
---

I was consolidating my notes (Bear) and journal (Day One) into Bear. [Day One](https://dayoneapp.com) has an "On This Day" and a Calendar view for looking back while Bear doesn't. I figured I could make a simple app that would: 
> Show [Bear](https://bear.app) notes that were created on today's date from previous years.

I wouldn’t need a custom tool but composite queries (like `x OR y OR z`) aren’t possible in Bear, yet. But I can make multiple queries and combine them (`x + y + z`) outside Bear;  Bear provides a bunch of callbacks, including one for search. This is all based on Apple’s inter-app communication protocol, [ `x-callback-url` ](http://x-callback-url.com). I had the "API" I needed. 

This turned out to be a very unpleasant endeavor of trying out libraries to build the app. I brought it on myself, but I still wanted to write about it.

Spoiler: I *didn’t* end up with an app. As with many things, the simplest solution was the best one (the hardest part is *thinking of* a simple solution). [I made a script](#keeping-it-simple)

## The libraries

### react-nodegui
The first thing I needed was a *good* library that will allow me to quickly build a GUI. Electron is off the list for myriad of reasons; especially how bloated it is. Other than building a native app (Swift) I didn't know any other options off the top of my head. I searched and stumbled upon [react/nodegui](https://github.com/nodegui/react-nodegui). It looked like a good alternative to electron, it (`nodegui`) renders with Qt5 and has css-like styling. I know React. "This will be quick", I thought. 
After spending more time on it: I was disappointed to realize it's not quite “ready”. Not like `v0.99.99` “ready” but “not production level” ready wink, wink. No, it's "couldn’t get it to work with a basic app" ready. My biggest issue was with the “scroll” container provided in the react library(`<ScrollArea />`)- it bugs out with changes in the size of its children (due to changes in state). I think with some sleuthing, I might have run into a trick to make it work. But, no time for that. This has to be simple. So I moved on.

### SwiftUI
My disappointing experience with `react/nodegui`  made me decide to “build native”. If I’m going to ignore electron, I should go with the most optimal solution. I was new to Swift but picking up the language didn't particularly worry me. What I dreaded was reading Apple’s documentation. Well, *finding* documentation. The closest I’ve gotten to the ecosystem is trying to write iOS shortcuts and realizing how frustrating finding docs can be. This would involve a lot of trial and error, which will ironically take longer than sticking with react; but native! It took me more than an hour to set up a project and write an app that renders the “note” UI I wanted. 

Once I “got” Swift UI though — it was a bliss. It was like writing React, or [Svelte](https://svelte.dev) - declare views, map values in view to state/props and everything gets rendered. If you haven’t worked with a declarative UI library: I recommend it. It “just makes sense”. 
Here’s an example of a grid layout with children populated from an Array, and accompanying styles:

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

Notice how properties are a `.{style}()` away...👌🏾.

The hard part of the work was getting bear notes in. In the  `react/nodegui` app, I used an external app [`xcall`](https://github.com/martinfinke/xcall) to make the x-callback calls (as a shell command) and parse the result in node. But since this is a native app, x-callbacks are native and I thought I shouldn't have to do that. I found a library that makes set up easy [CallbackURLKit](https://github.com/phimage/CallbackURLKit). Adding a dependency is surprisingly easy in xCode (paste the link to the git repo and it handles everything). Unfortunately, **using** callbacks is where I hit a brick wall and couldn't get things working. As I understand it, x-callbacks are stateless, idempotent calls (in a way, they’re RESTFUL). What I needed was stateful. I couldn’t combine results from multiple calls because each time a new result is returned, the app receives it in a “clean state” - in fact it would spawn a new window for each returned callback result. I constrained the app to single-window but that didn't solve it. I might be wrong on my theory of the cause of the problem but that's as far as I got. I felt like I had spent too much time. I had to abandon Swift UI. 

### pysimplegui
Swift and node have failed me (well, arguably, I failed myself through my impatience, but ... meh) - time for another language - Python. I might have googled “python easy UI library” for [`pySimpleGUI`](https://pysimplegui.readthedocs.io/en/latest/) to come up. This library is fine. It's definitely **simple**. But, I didn't have to spend a long time with the docs and playing with the code to know it's not going for a "clean" (modern?) look. A “pretty app” wasn’t what I setout to make, but seeing something that *didn’t* look good certainly made me look elsewhere. 

### wxPython
wxPython also appeared a lot in results. I read through [wxPython’s documentation](https://wxpython.org). I spent more time on this than I did with PySimpleGUI because the API is pretty extensive. I could *technically* create the card views I was looking for. But, unfortunately, like Swift, I didn’t quickly find easy-to-understand, code I could copy paste. Of all the complaints about JavaScript, finding good documentation and examples is usually not a problem. To me, the wxPython docs were written for someone familiar with wxWidgets but wants Python. I might be wrong I wasn't exactly in detective mode, figuring out the styling model was more difficult than I liked. SwiftUI was easier in this sense: what *feels* like the right way to do something is usually the right way to do it. So I continued with my search.

### pywebview
I searched more and stumbled upon pywebview. I wish I had found this first.
This is a full-stack app with a python backend and a web front end, bundled up. Sounds familiar. But, this is different from all the javascript/Python libraries I (partially) tested. `pywebview` uses the system’s webview; theoretically yielding a much smaller bundle than an electron app with Chrome. What quickly stood out to me is how easy it is to send data back and forth from javascript <-> python unlike some other `webview` libraries [here](#misc). 

For example sending notes to the UI:
```python
class Api:
    def fullscreen(self):
        webview.windows[0].toggle_fullscreen()

    def ls(self):
        return os.listdir('.')
    
    def bear_notes_this_day(self):
        notes = notes_from_this_day(10)
        return notes

...

if __name__ == '__main__':
    window = webview.create_window('pywebview-react boilerplate', entry, js_api=Api(),)

```

And  receiving in javascript:
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

This is admittedly more complicated than nodegui which is JavaScript all the way and needs no interop. But, it works! And the components worked. It *scrolls*. CSS is exactly as it should be. The renderer is not *trying* to be html. It **is** html. There is a [React starter](https://github.com/r0x0r/pywebview-react-boilerplate) that I built on top of. I got the app I wanted in no time. I even took time to style it a bit: 

<media-box src="media/simple-mac-app/pywebview.png" name="Complete PyWebview App."></media-box>

This was the only app I bothered to generate a bundle for. It came out to 12MB - this is certainly better than Electron, a small win. Unfortunately, the built app wouldn’t open. I don’t know what I did wrong. But at this point, I had **had** it. I was done. I’d spent too long on this. Basically abandoned this whole idea. I had things I wanted to work on.

Later that day, I got a notification on my phone from Day One reminding of my journal entries from this day -💡!.

## Keeping it Simple
That notification from Day One made me feel like (or better, realize) I had just wasted my time [bike shedding](https://en.wikipedia.org/wiki/Law_of_triviality). Couldn’t I just write something that sends a notification of notes from this day to my mac everyday? That's simpler than my initial idea. I did that. I wrote it in node because it was the one with the easiest, copy-paste ready, documented library [`node-notifier`](https://www.npmjs.com/package/node-notifier). 

The code looks something like: 
```javascript
  for (let year = currentYear - 10; year < currentYear; year++) {
    const cmd = `xcall.app/Contents/MacOS/xcall -url "bear://x-callback-url/search?term=@cdate(${month}-${day}-${year})&show_window=no"`;
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

I then set automator to run the script every day. And now I get this every day:

<media-box src="media/simple-mac-app/notification.png" name="Daily Notes in Notification Center."></media-box>

## In the End
There might not be much to learn from my particular unpleasant experience. I was pretty impatient. So, if you’re impatient and searching, maybe this will save you some (more?) time:
- If you’re building an app for Mac OS, use Swift (Swift UI). It’s really not hard to learn and I think it will genuinely be a joy to use. Plus, your app will be small, performant, and have access to **all** of the goodies of the ecosystem.
- If you don’t want to learn Swift, *need* cross-platform, don't have the capacity/time to do native, then I think electron is the best bet - for now; unless you’re willing to start and then run into random issues that will make the journey very painful, very quickly.

### Misc.
There are a lot of libraries that are more minimal than electron including:
	- [`webview/webview`](https://github.com/webview/webview) (really sparse on docs)
	-  Microsoft’s [`React Native`]( https://microsoft.github.io/react-native-windows/) - also sparse on docs, especially for MacOS.
	None of these look like something to build any substantial with. Probably on the same level as [`Flutter`](https://flutter.dev/docs) for desktop - which is also not ready for prime time.
	
 I think the ecosystem will be pretty exciting with more time, when these libraries are mature. Something to look forward to.
 