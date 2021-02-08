---
title: "You may not need React"
date: "2021-02-10"
description: "Creating an interactive web page can be done with libraries that are simpler than React: alpineJS and Svelte; or even no library at all: vanillaJS. "
bannerImage: "media/you-may-not-need-react/alpine.png"
tags:
  - "technology"
---

I think it’s fair to say, that at the current state of web development, React is [*de facto* UI library](https://trends.google.com/trends/explore?cat=31&q=Vue.js,React,Angular). And for good reason. It’s *relatively* high-performance and easy to learn, and more importantly, has a tremendously large ecosystem around it. Just about anything you want to create, there's a good chance someone made it, and has it available as a package.  It’s not perfect. But it's also just not always the right library for web pages. This is an exploration of libraries I’ve used and I consider to be, in certain ways, better alternatives.

## Going React…less?

I still primarily use react, I am confidently productive writing in the hooks/functional pattern (in fact, I *enjoy* that pattern). However, I have read opinions against having to set up a development environment just make a site interactive. Which is absolutely fair, responding to clicks, making http calls, and substituting elements on a page in response to events, is *not* that hard at small scale. Having to use `webpack`, or `rollup` and `babel` just to get that is — can be an overkill. The same complaint applies to `Angular` and `Vue` (with single file components) or any other library that requires a build step.
For creating a new web app - its good to consider using something (significantly) simpler than react - it will remove a lot of complication and drop development time. Of course the problem being solved is the most important, some of these options may not scale to a large multi-team projects effectively. 

This is what a react component that has a counter looks like:
```js
import { useState } from "react";

export default function App({ name }) {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <p>My name is {name}</p>
      <h1>Button Clicked: {count} times</h1>
      <button onClick={() => setCount(count => count + 1)}>Add 1</button>
    </div>
  );
}
```
This is fairly succinct, thanks to the many arrow functions flying around. 
Anyone unfamiliar with react, would probably have to do a double take on the `onClick` handler. 
What's more important though, is that all the code here, is negligible compared to what the browser will *actually* run - all of the `JSX` that's returned by the function isn't valid javascript - it's syntactic sugar for more complex function calls to React APIs. This is what I sometimes find unnerving about react, especially with smaller apps. There seems to be a little too much abstraction (for questionable benefits). There are many, many alternatives. JavaScript isn't exactly short of libraries, but I want to focus on 3 options, I would vouch for.

## VanillaJS

The first option here, is, well, the “use nothing” option. Just write JavaScript, inside html (or a script file) and make use of all the native DOM (the [document object model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) that represents the html in a page) apis; the same ones every other library depends on anyway. The `"vanillaJs"` route. I recommend reading the tongue-in-cheek site created for [vanillajs](http://vanilla-js.com).
What’s impressive is just how much more efficient using the plain/vanilla is than adding a library - essentially adding a middle-man to all the dom actions that need to be done. This is definitely going to be the best-performing approach to write a web app. Bundle size is 0Kb+ (where you only have to add however many lines of code you write). Nothing beats that. And of course, there’s no build step. Just write, save. And you’re done. 

### Vanilla JS Example

Here's a working example of an incrementing button in vanilla js.
```html
<html>
  <body>
    <div id="app">
      <p id="label">Button clicked: 0 times</p>
      <button id="click">Add 1</button>
    </div>
    <script>
      const btn = document.getElementById("click");
      const label = document.getElementById("label");
      let clicked = 0;

      btn.addEventListener("click", () => {
        clicked += 1;
        label.innerText = `Button clicked :${clicked} times`;
      });
    </script>
  </body>
</html>
```
This *looks* like a stateful component in vanilla, but it's definitely not. There are a lot of ways to poke holes at this, and find bugs. It's intentionally simple, and addressing all the bugs/creating proper state management is beyond the point of this post. I'm simply highlighting what's *possible*.

## AlpineJS

AlpineJS is, I think, the perfect bridge between repeatedly writing code to CRUD (create, read, update, delete) DOM elements, and reaching for a full-fledged library that abstracts away all the apis. With vanilla js, these operations are as fast as they will ever get, but it also gets very redundant calling `document.getElementById` every time etc. Any ~~lazy~~ good developer will get sick of doing this, create helper functions, classes to reduce the repetition, and by the time they’re done, they would have created the ten-thousandth javascript UI library - or they might accidentally recreate alpineJS.
[AlpineJS](https://github.com/alpinejs/alpine) is a “script” in the strict meaning in html. It’s pre-compiled, comes in at 4Kb, and provides exactly 14 directives for working with the dom (plus 6 properties that are more advanced usage-type). Yes, the entire API is just 14 concepts to learn. It literally takes reading a readme file to learn all of alpinejs. I would be hard pressed to find another framework that can boast such simplicity. And using alpinejs only involves dropping a script tag in an html file, and that’s it. Directives are used by adding them to the respective element. E.g 
```html
<h1 x-show="false">I will be hidden</h1>
```
It provides an `x-data` directive that creates a scope (essentially state) for an html element. `x-show` to toggle the visibility of an element, like above.
 `x-model` to 2-way bind an input element to a variable - this takes multiple lines in react, as you need to declare state, bind the value of an input (one-way) to the state, and then set up an event listener to update the state when the input changes. That gets tedious, but it needs to be done — every time.
`x-for` for loops… and other directives listed in the [documentation](https://github.com/alpinejs/alpine#learn).
These directives are similar to how vue works as well. With the added benefit of not requiring any build step, and being a much smaller, bundle and smaller API.
For adding new elements, alpine cleverly uses [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)elements which is natively hidden-by-default and is *meant* to be used precisely as fragments to be used by scripts - essentially a simpler model for what a **component** is in react. I really like that alpineJs embraces and properly utilizes native DOM apis this way.
Here’s the same demo but with alpinejs:

### Alpine JS Example

This is a working example of a stateful component (click counter).
This can be served as working webpage, as-is.

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
  </head>
  <body>
    <div x-data="clicks()" id="click-counter">
      <p x-text="text">Button Clicked:</p>
      <button @click="increment()">Add 1</button>
    </div>
  </body>
  <script>
    function clicks() {
      return {
        clicked: 0,
        get text() {
          return `Button Clicked ${this.clicked} times`;
        },
        increment: () => this.clicked += 1
      };
    }
  </script>
</html>
```

## Svelte

Another common bone of contention is the way react works itself, particularly around the virtual dom. It’s part of why every react app has to ship a minimum of 40kb+ of js size (react + react-dom) to work with react - well that and its pretty extensive API. This isn’t earth-shatteringly large but it’s also not zero. And *not* using react will definitely bring that size down to the negligible range. Shipping very small bundle size is just great, with no downside….? This is one of the reasons I liked [Rust](/trying-rust-lang) - you don’t pay for what you don’t use, no garbage collector.
 There are many benefits to it, like: 
1) less memory and storage usage
2) less network traffic usage, 
3) definitely faster time to start (or time to first byte, TTFB in a web app) because of 1) and 2)
4) possibly general snappiness because there’s just less code to run.

[Svelte](https://svelte.dev/docs) is akin to Rust in this sense. It *has no* runtime. All of svelte’s magic is done at compilation. You don’t pay for what you don’t use. And the script that’s generated is all *your* logic with svelte helper functions, directives etc added around it.
Unlike vanilla and alpine however, I find svelte to be a much steeper climb when it comes to learning. I build a basic [contact image generator](https://github.com/dshomoye/image-my-contact) with svelete to learn it  and that was definitely not as simple as working alpinejs (and admittedly very high bar). So yes, svelte is probably as complex as react, to learn, but actually functions much simpler than react.

For example, to create a stateful component in svelte looks like:

```html
<script>
	count = 0 // declare state
	export name = "" // this is a prop
	const increment = () => count += 1
</script>

<div>
	<p>My name is {name}</p>
	<p>count: {count} </p>
  <button on:click={increment}>Add 1</button>
</div>
```

Updating state is just a reassignment of that variable.
That’s it. I think this is *more* natural than in react. Although, I still prefer the functional/no mutation approach in react, since it reduces chances of unintentional state updates and the bugs that comes with that.

And for a component property (values passed from a parent), its just a variable export. 
The reason I like Svelte, is because, it’s “simpler” than react in the sense that you write less code to achieve essentially the same functionality. So generally, you’ll fewer lines of code to get a working app. And less, well, less is more (always). Of course, the fact that Svelte is compile-time instead of a run time library is just icing on top. I would still recommend it *if* it had a run time like react. Just because it presents this more approachable API.

So there you have it: three simple alternatives to consider, when creating a new web app. There's a certain level of, *bliss* I'll call it, that comes especially when using something like alpinejs (or vanilla) - where your html and script **is** your application. It goes to show that web development can be easy. I think the ecosystem would a little better, if every developer always focuses on Keeping It Simple.
