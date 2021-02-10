---
title: Learning Observables the hard (easy) way 
date: "2020-10-22"
description: ReactiveX is the new black.
bannerImage: "reactivex.png"
tags:
  - "technology"
---

Observables (ReactiveX/Observer pattern) seem to be showing up everywhere I look. Or maybe I have just been looking for it. Either way. I’ve felt like I needed to learn to use them. Even though I haven’t had a problem requiring Observables. Well, I guess not even really knowing how it worked meant I had no idea when I *should* opt for it. So I did the next best thing: I shoe-horned it into a problem I had. And now that I’m through with it, I have a grasp of observables enough that I wanted to write down the process. For posterity. This will focus on rxjs (the Reactive library for JS) but the Observable pattern is implemented in a lot of major languages, [see here](http://reactivex.io/).

The real problem that led me down the Observable rabbit hole: While working on the revamp from python to JS of my LastFM based project (💀 RIP. Cause of death: needlessly complicated code). I needed to make 0-100s of API call to LastFM, to pull in all of the historical data that any user scrobbled to the service. This only matters for the first run per user but I still had to deal with it; Now I wanted to deploy this app to Vercel. It’s free for pet projects! But Vercel only provides serverless functions, so I had to design the “API calling” workflow around a serverless API that cannot run for more than 10s. The set up I wanted to create is a portal of some sort that shows the progress of the download (5%, 10% ...). The actual pulling and saving to the database process have to happen on the backend (API keys and whatnot). But because of the serverless max run time, I definitely can’t make 100 calls in 10s.

So, I came up with a not-so-pretty solution. I have an endpoint that specifies how many API calls (pages) need to be made to get all the latest scrobbles. And for each page, the UI calls the backend to request a “pull” for that specific page. So instead of invoking the backend function to pull all the data at once - which will timeout. I call the backend n+1 times, (n=number of pages). Invocations are “cheaper” than run times. And the part that needs Observables? Well, it turns out showing the progress of the download is harder than it seems. 
And **this** is where Obsevables shine. In fact the table on the `rxjs`  page for observables [hints at it](https://rxjs-dev.firebaseapp.com/guide/observable) - observables are the solution to the “multiple promises” scenario. You have a bunch (or infinite) number of promises and want to receive the result when any of them resolve, and keep receiving the result until exhausted.
I was surprised this is not a very straightforward issue to solve natively in JavaScript. But, `Promise` only has `.all()` and `.allSettled()`  - they both wait for  *all* `[]Promise` to resolve before resolving themselves.  `all()` even exits on the first error!
Whereas with an observable, you can dispatch multiple async calls, subscribe, and then listen for each resolved/emitted/errored value in a function.
This is the implementation I came up with: 
```javascript
export function saveScrobbles(username, totalPages, fromTime) {
  let currentPage = totalPages;
  const promises = [];
  while (currentPage > 0) {
    const p = fetch(`/api/scrobbles/${username}`, {...});
    promises.push(p);
    currentPage -= 1;
  }
  return from(promises).pipe(mergeAll());
}
```

- `from()` is an `rxjs` function for converting values *and* promises to observables;
- `pipe()` is a sort of helper function, for easily chaining operators. So if a, b, and c are operators that need to be applied to result of an observable o$, and they need to be applied in the order  c(b(a(x))). this can expressed in a pipe as  `.pipe(a(), b(), c())` where each function gets the result of the preceding function call. `rxjs` has a **lot** of operators, infact, that’s the **real** sell of the project  *[Think of RxJS as Lodash for events](https://rxjs-dev.firebaseapp.com/guide/overview)*. It facilitates writing in a functional way; you can `pipe` a `filter` into a `debounce` into a `map` into `merge` quite easily.

The `saveScrobbles` function returns an observable, and the subscription looks like:
```javascript
    const pages$ = saveScrobbles(username, totalPages, from);
	  ...
    pages$.subscribe({
      next: () => {
        setCompletedPages((prev) => prev + 1);
      },
      complete: () => {...},
    });
```

Once an observable is called with`.subscribe()`, the `next()` function is called every time a new value is returned. Technically, the signature is `next(value)` but I didn't use the returned value here.
The `complete` function is called when all values have been emitted. This is equivalent to what you would normally have access to when using `Promise.all()` or `Promise.allSettled()`. 
There’s also an `error` function whenever an error occurs while getting a value - not used here.
One very important property of observables that I am not even taking advantage of here, is that there can be multiple subscribers. This is another part of what makes observables powerful. It's not possible to `Promise.all()` more than once. But `page$.subscribe` can be called multiple times from different places (and the `next`, `error` and `complete`  will be called individually).

So, `completedPages` is the number of pages updated, and since there’s already access to the total number of pages. It’s trivial to show the percentage completed.
And that’s it, a very simple to use Reactivity/Observables.
I should reiterate this is barely scratching the surface of what’s possible with observables, more a basic intro for *understanding* what they are.
Also, I know there are better solutions to this problem. For one, a regular web-server can make all the calls and have an endpoint that gets polled to get the progress state. Or, using a Websocket for instant progress pings - I think this is preferable since it will avoid the polling logic - which could lead to a lot of GET calls as well.

Some good references:
- Netflix Engineering video [video](https://www.youtube.com/watch?v=AslncyG8whg) on rxjs.
- [rxjs](https://rxjs-dev.firebaseapp.com/guide/overview). 
- [ReactiveX - Intro](http://reactivex.io/intro.html)