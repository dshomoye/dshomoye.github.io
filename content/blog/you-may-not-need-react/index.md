---
title: "You may not need React"
date: "2021-02-07"
description: "Interactive web pages can be created with libraries that are simpler than React: alpineJS, Svelte; or even no library at all: vanillaJS. "
bannerImage: "media/you-may-not-need-react/alpine.png"
tags:
  - "technology"
---

I think React is currently the [*de facto* UI library](https://trends.google.com/trends/explore?cat=31&q=Vue.js,React,Angular) for web development. And for good reason. It’s *relatively* high-performance and easy to learn, and more importantly, has a large ecosystem around it. Just about anything you want to create, there's a good chance someone's made it, and has it available as a package. But React is not perfect and not always the right choice. This is an exploration of libraries I’ve used and I consider to be, in certain cases, better alternatives.

### Going React…less?

I still primarily use react, I am confidently productive writing in the hooks/functional pattern - in fact, I *enjoy* the pattern. However, I think it can be over an overkill for simple use cases. Responding to event, making http calls, and substituting elements on a page, is *not* that hard at small scale. Having to transpile and bundle - fiddling with `webpack` and `babel` etc... just to get some interactivity — can be an overkill. The same complaint applies to `Angular` and `Vue` (with single file components) or any other library that requires a build step and has a non-trivial runtime.
For creating a new web app - its worthwhile to consider using something simpler than react - it will remove a lot of complication and reduce the time it takes to create a working app. Of course, the problem being solved is the most important consideration for making a final decision.
 
For the most basic "sample" app: this is what a react component that has a counter looks like:
```js
import { useState } from "react";

export default function App({ name }) {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <p>My name is {name}</p>
      <h1>Button Clicked: {count} times</h1>
      <button onClick={() => setCount(count => count + 1)}>Add 1</button>
    </div>
  );
}
```

What's key is that most of this code is tiny compared to what the browser will *actually* run - all of the `JSX` (html-looking part) inside the `return` statement isn't valid javascript - it's syntactic sugar for more complex function calls to React APIs and it all gets transpiled and bundled to be runnable. This is what I sometimes find unnerving about react, especially with smaller apps. There can be a little too much abstraction. There are many, many alternatives to React. JavaScript isn't exactly short on libraries (for better or worse), but I want to focus on three.

### VanillaJS

The first option here, is, well, the “use nothing” option. Just write JavaScript, inside html (or a script file) and make use of all the native DOM (the [document object model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) that represents the html in a page) apis; the same ones every other library depends on anyway. The `"vanillaJs"` route. I recommend reading the tongue-in-cheek site created for [vanillajs](http://vanilla-js.com).
What’s impressive is just how much more efficient using plain/vanilla is over adding a library - essentially a middle-man to DOM operations. This is definitely going to be the best-performing approach. Bundle size is 0Kb+ - you only have to worry about how much code *you* write. Nothing beats that. And of course, there’s no build step. Just write, save. And you’re done. 

#### Vanilla JS Example

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

I consider this a clearer, more explicit code than the react example. It is *exactly* how the browser works. Creating a non-trivial web page using this vanillajs is a good learning experience; even if for no other reason than understanding how the browser APIs actually works. 

This *looks* like a stateful component in vanilla, but it's definitely not. Based on use-case, it could be buggy. It's intentionally simple, and addressing proper state management is beyond the point of this post. I'm simply highlighting what's *possible*.

### AlpineJS

I consider alpinejs the perfect bridge between repeatedly writing code to CRUD (create, read, update, delete) DOM elements/listen for events (like above), and reaching for a full-fledged library - like react etc; that abstracts away all the apis. With vanilla js, these operations are as fast as they will ever get, but it also gets very redundant calling `document.getElementById`. Many ~~lazy~~ good developers will get sick of doing this, create helper functions and classes to reduce the repetition, and by the time they’re done, they would have created the ten-thousandth javascript UI library - or they might accidentally recreate alpineJS.
[AlpineJS](https://github.com/alpinejs/alpine) is a “script” in the strict meaning in html land. It’s bundle comes in at 4Kb, and provides exactly 14 directives for working with the dom (plus 6 properties that I think are more for edge cases). Yes, the entire API is just 14 basic concepts to learn. It literally takes reading a readme file to learn all of alpinejs. I would be hard pressed to find another framework that can boast such simplicity. And using alpinejs only requires adding a script tag in an html file, and...that’s it. Directives are used by adding them to the respective element, these are native dom elements, not JSX or some other syntax magic. Example:

```html
<h1 x-show="false">I will be hidden</h1>
```

`x-show` to toggle the visibility of an element, like above. `x-data` directive that creates a scope (essentially, a state) for an html element. `x-model` to 2-way bind an input element to a variable - this takes multiple lines in react, as you need to declare state, bind the value of an input (one-way) to the state, and then set up an event listener to update the state when the input changes. That gets tedious, but it needs to be done — always.
`x-for` for loops… and others in the [docs](https://github.com/alpinejs/alpine#learn).
These directives are similar to how vue works as well. With the added benefit of not requiring any build step, and being a much smaller bundle and API.<sup>[1](#notes)</sup>
For adding new elements, alpine cleverly uses [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) elements which is *meant* to be used precisely as fragments to be referenced in scripts - essentially a simpler model for what a **component** is in react. I really like that alpineJs embraces and properly utilizes native DOM apis this way.

Here’s the same counter but with alpinejs:

#### Alpine JS Example

This is a working example of a stateful component (click counter).
This can be served as an html file, as-is - and it will run!

```html
<html>
  <head>
    <script 
      src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"
      defer></script>
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

### Svelte

Another qualm I consider is the way react works internally, with the virtual dom. It’s part of why every react app has to ship a minimum of 40kb+ of js bundle (react + react-dom) to work with react; that and its pretty extensive API. This isn’t earth-shatteringly large but it’s also not zero. And *not* using react will definitely bring that size down by a lot. Shipping very small bundle size is just great, with no downsides…? This is one of the reasons I really like [Rust](/trying-rust-lang) - you don’t pay for what you don’t use.

[Svelte](https://svelte.dev/docs) is akin to Rust in this sense. It *has no* runtime. All of svelte magic is done during compilation. You don’t pay for what you don’t use. And the script that’s generated is all *your* logic with svelte helper functions, directives etc added around it.
Unlike vanilla and alpine however, I find svelte to be a much steeper climb when it comes to learning. I build a basic [contact image generator](https://github.com/dshomoye/image-my-contact) with svelte to learn it  and that was definitely not as simple as working alpinejs (and admittedly very high bar). So yes, svelte is probably as complex as react, to learn, but actually functions much simpler than react.

For example, to create a stateful component in svelte looks like:

```html
<script>
	count = 0 // declare state
	export name = ""; // this is a prop
	const increment = () => count += 1;
</script>

<div>
	<p>My name is {name}</p>
	<p>count: {count} </p>
  <button on:click={increment}>Add 1</button>
</div>
```

Updating state is just a reassignment of that variable. That’s it. 
I think this is more natural than in react. Although, I still prefer the functional/no mutation approach in react, since it reduces chances of unintentional state updates and the bugs that comes with that.

And for a component property (values passed from a parent), its just a variable export. 
The reason I like Svelte, is because, it’s *simpler* than react in that you write less code to achieve essentially the same functionality. And less, well, less is more (always). Of course, the fact that Svelte is compile-time instead of a run time library is just icing on top. I would still recommend it *if* it had a run time like react <sup>[2](#notes)</sup>. Just because it presents this more approachable API.

So there you have it: three simple alternatives to consider, when creating a new web app. There's a certain level of, *bliss* I'll call it, that comes especially when using something like alpinejs (or vanilla) - where your html and script **is** your application. It goes to show that web development can be easy. I think the ecosystem would be a little better, if us developers focus more on Keeping It Simple.

##### Notes:
1. Vue can technically be used as a script tag - but that's not really how it's expected to be used, and so most of its API is designed around a project structured with a bundler.
2. It could be debatable want "counts" as a run time. But svelte has no minimum bundle size like react does - your bundle size grows linearly with your code. I think that's a good place to draw the line.