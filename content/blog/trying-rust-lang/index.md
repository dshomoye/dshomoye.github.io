---
title: "Testing the waters - Thoughts on Rust."
date: "2020-12-17"
description: "The not-so-steep uphill climb to building in Rust."
bannerImage: "cargo.png"
tags:
  - "technology"
gallerySources:
  - caption: "Helpful Rust compiler messages."
    src: "media/trying-rust-lang/rust-compiler-message.png"
    type: "image"
---

Rust holds the crown for “most-loved” language ([5 years in a row](https://insights.stackoverflow.com/survey/2020#technology-most-loved-dreaded-and-wanted-languages)) according to the stack overflow survey - quite an impressive feat. I actually didn’t _know_ Rust was this beloved until I started writing this post and checked its position. I however have been wanting to foray into development with WebAssembly (wasm) for some time. Rust probably has the largest ecosystem for building with WebAssembly. And best suited for wasm over languages like Java or C# (or even GoLang) since they all have garbage collectors and require at least some form of minimal run time to be packaged with the code to run. Compiled rust wasm will generally come out smaller than the alternatives since it has no garbage collector - and smaller is **always** better with web apps.

Rust is like C++, but it makes memory management/safety _much less_ painful. The hard work is done at **compile time**. Just thinking of the many times I got `segfault` writing C++ in college… yikes 😟. This is where Rust shines - while staying as efficient as C++. I say “efficient”, without any numbers but Google “Rust” and the first sentence should be “Performance.” (Literally, that one-word sentence).

I have _tried_ Rust before, but the first try left me very… confused. I was “fighting the borrow checker” (a key way Rust guarantees memory safety) so I sort of… ~~gave up~~ put it in the backlog. Knowing that I wanted to do something (anything) with Rust, my first goal was finding out ax “Hello World” program. It was mostly by chance, but I found [yew](https://yew.rs) on [the "realworld" repo](https://github.com/gothinkster/realworld). Yew is a framework for building web apps with Rust. I will not write about setting up Rust, the [rust documentation](https://doc.rust-lang.org/book/ch01-00-getting-started.html) is a great resource (and always my go-to when lost).

Yew was fairly straightforward to get started with. There’s a sample app in the documentation that I was able to run within minutes. The framework is component-based so coming from mostly React, I felt at home - at least from a high level. Components have state and receive props from their parents. I highly recommend reading the yew docs if curious. The documentation is solid. (A very common theme in Rust-land).

I wanted create something that does a little more than showing hard-coded text, maybe call an API and update the UI based on the response.
So, I decided to create a clone of [rickandmortyapi.com](https://rickandmortyapi.com) with Yew. I don’t think one should reach for Yew just to build a web app that calls an api and writes the response. (You could get away with **no framework** and just write a few lines JavaScript). But this was a happy medium for me, especially since I didn’t have a computationally complex problem to solve.
I used [create yew app](https://github.com/jetli/create-yew-app) to bootstrap a new app and created an (ugly) clone of the site.

The result is [here](http://old-test.surge.sh).
Here's a snippet of a component method (`rendered`) that's called at every render (a `useEffect` in React).
Here, I'm calling the api after the first render to fetch characters for the first page:

```rust
    fn rendered(&mut self, first_render: bool) {
        if first_render {
            let link = self.link.clone();
            wasm_bindgen_futures::spawn_local(async move {
                let cs = get_page(1).await;
                match cs {
                    Err(e) => {
                        ConsoleService::error("failed to get characters");
                        ConsoleService::error(&e.to_string());
                    }
                    Ok(r) => {
                        link.send_message(Msg::UpdateCharacters(r.results));
                        link.send_message(Msg::UpdateCurrentPage(1));
                        link.send_message(Msg::UpdatePageInfo(r.info));
                    }
                };
            })
        }
    }
```

One major highlight from this is [pattern matching](#pattern-matching).
The code would not compile if the error branch was not handled. Seemingly trivial but, I think it's one of those guard rails that's really protecting the programmer from self-inflicted pain.

The `get_page` function is from [`rick_and_morty`](https://crates.io/crates/rick-and-morty) crate which was added after finishing the yew app and realizing it should be easy to refactor and publish the logic as a separate library (I noticed Rust was missing from the helper libraries available [here](https://rickandmortyapi.com/documentation/#libraries)).

I am so surprised at how easy it was for me to create a library in Rust. Really, why isn’t every other language like this? This started with me wanting to learn Rust by writing a WebAssembly app; It ended with me publishing a [crate](https://crates.io/) in Rust (and absolutely loving the entire process).

---

### Editor Support:

I was hoping to find a dedicated IDE for Rust. It seems like it would benefit a lot from having a full-fledged environment (like Goland) - there isn't one. But, there is a pretty solid [extension](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust) for VS Code. I was not expecting anything impressive. VSCode is, a code _editor_ at the end of the day. And it especially seems to struggle with everything that’s not JavaScript or TypeScript. My main issue is how it slows down with larger codebase, “Go To Definition” sometimes refusing to work. The Rust extension was pretty good. I think an IDE would do even better (and I’m hoping JetBrains makes one 🤞🏾). The main issues I ran into were (rare) occasions where hovering a `function`, `Struct`, `method` etc would not show the proper documentation for it, and trying to go to the definition would also not work. Also, lint and error checking always take an extra second to show after saving. So it always feels like the editor is trying to catch up to me. After linting and compiling is done, and the messages show up in the editor— wow, I don’t think I’ve worked with a compiler as helpful as Rust’s.

### Compiler Messages

Rust’s compiler errors and warnings are probably the most pleasant part of working in Rust when just getting started. I don’t remember the compiler being this friendly the first time I tried Rust (3-ish years ago). It points out exactly where something’s gone wrong and, often, even suggests _how_ to fix it.
This is an example of one such message that shows in VSCode:

<media-box src="media/trying-rust-lang/rust-compiler-message.png" name="A very helpful message from the Rust compiler." index=0></media-box>

This makes coding a lot easier - and the image is possibly the most trivial example. There are also a _lot_ of compiler flags to warn/error on things like unused imports/dead code, and even fail on missing documentation! This may not be groundbreaking but I think Rust`s approach just makes it so … approachable :).

### Life Time And Borrow Checking.

I can't write too much on this as I am definitely not an expert. But it is important to write just about any Rust code. It’s how Rust makes sure references that are no longer used are discarded (and discarded references are _never_ used).
I didn’t find it too hard to wrap my head around this - even though it was my point of failure the first time I tried Rust. It’s like learning how scopes work and then turning it up to 200. I recommend reading the Rust book’s [primer](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)

### Pattern Matching.

After working with Rust’s `Option` and `Result` types. Going back to writing JavaScript feels like a regression.
Rust has a `match` expression which is like a `switch` statement (or `if/else` ) in most languages - except it _makes_ you write code better. A lot better.
Things like `switch` fall-through - which, you know, why? WHY do so many languages have switch statements fall through by default?? (and _require_ using a `break` - leading to weird bugs in code, because a switch branch is missing a `break`). No more dealing with all that nonsense. `match` to the rescue! What I like the most about `match` is the exhaustiveness of it. If you switch over an enumeration of 3 possible values. And then later the enum is extended to 4. In most languages, the previous code would still work (but could potentially have bugs because of a missing case). With `match` - that missing case is a compile error! These are the kind of edge cases you’d need unit tests for — and now they’re free.
This really shines when dealing with an `Option`. A wrapper for something that could have a `Some(value)` or be `None`. `match` forces you to write the code to handle both cases. Every time. So you’ll never accidentally pass a `None` to a place that can’t handle it! (No more `null pointer exceptions`) The same for `Result` (as in the sample code). Ensuring an error is **always** handled. There’s some helper methods for working with these types. But the general rule is: you won’t unintentionally miss an edge case. This is great. It actually frees up more mental real state knowing the compiler has your back that way.

## Macros

Macros in Rust were sort of like voodoo the first time I saw it (why is it `println!()` and not `println()`). I mostly ignored how it works and just _used_ it when I needed it. I started to appreciate the power of macros when I jumped into `yew` and noticed that they had created a `jsx-like` syntax for writing declarative html views.
There's an `html!` macro that renders html views. In the rickandmorty app, this is a sample macro that renders a single character:

```rust
            html! {
                <li class="character-list-item">
                    <div class="character-container">
                        <div>
                            <img src={copy.image} alt={"image of"} />
                        </div>
                        <div>
                            <p>{copy.name}</p>
                            <p>{"Status: "} {copy.status}</p>
                            <p>{"Location:"} {copy.origin.name}</p>
                        </div>
                    </div>
                </li>
            }
```

I haven't written any macros (and I doubt I'll need to anytime soon), but my little trick of understanding them is they're a way of auto-generating code ("meta-programming"). So the macro is "expanded" at compile time into rust code (i.e. code that creates the dom elements in the case of `html!`).
If you're wondering _why_ macros, why not functions? Good question; Rust doesn't have function overloading, or variadic parameters, so in this `html` case where the dom tree structure (the function input) cannot be known beforehand, the equivalent function is basically impossible to write. Hence a macro is needed.

### Package Management (Cargo, crates.io, docs.rs)

Dealing with webpack has to be one of the last things I ever want to do when working in a large JavaScript project. It’s like it was deliberately designed to be complex (complicated?) and intimidating. I mean, I get that it's actually solving a problem but, it's a pain. CLI tools like vue, angular and create-react-app have made things a lot easier but - those are all framework-specific. So whenever there’s a need to do something the defaults aren’t designed for - well, that becomes a rabbit hole. Cargo is what I _expect_ a package manager to look like. There are commands for everything from creating a new rust library or binary, running tests, generating docs, building the code, packaging _and_ publishing.

Knowing the process is so straightforward (and very well documented) motivated me to create a new library (`cargo new --lib {lib name}`) and publish it on (`cargo publish`) [crates.io](https://crates.io/crates/rick-and-morty) and have the documentation automatically generated on [docs.rs](https://docs.rs/rick-and-morty/0.1.0/rick_and_morty/) (with a viewable local version through `cargo docs`). I did across about 3 days in my spare time. From scratch, learning the language, ecosystem and publishing a package. That’s not something I think is easily done in many other languages. The actual library (and what it does), I don’t think is impressive. But how the entire process worked - makes me feel like I can more easily build something in Rust, and not feel like I’m fighting everything else along the way.

Rust is a relatively new language compared to most other popular languages like Python, JavaScript, C/C++; even GoLang is older (and Go probably excels to some extent on the same things mentioned). So it has had the chance to learn from all the bad decisions (and does JavaScript have a lot of those) - and really do things right. It excels at `It Just Works`™ . And for that, I am glad. I can’t wait to figure out _what_ to do with all this `power`.

To reiterate: I’ve only spent a few days with Rust, there is a ton more stuff that Rust offers that I haven’t tried yet. To the Rust expert, forgive my naiveté.

My wishlist for Rust long-term:

- A solid cross-platform sdk for building native apps. I generally prefer the speed of native apps versus electron-based apps. But there really aren't a lot of great alternatives to electron and JavaScript here (ie. VSCode's unimpressive handling of large files vs Sublime). I think Rust would be a perfect fit.
- Native DOM apis for wasm. Right now, wasm code, regardless of the language, still depends on the JS dom api for making changes to UI. So technically, they're not yet any faster than JavaScript. That will (hopefully) eventually change. And when it does; I think the web will become an even more platform for building... everything.

---

## Useful Links:

- [Setting up Rust](https://doc.rust-lang.org/book/ch01-00-getting-started.html)
- [Yew](https://yew.rs)
- [Create Yew App](https://github.com/jetli/create-yew-app)
- [rickandmortyapi.com](https://rickandmortyapi.com)
- [rick-and-morty rust library code](https://github.com/dshomoye/rick-and-morty)
- [rick-and-morty crate](https://crates.io/crates/rick-and-morty)
- [docs for crate](https://docs.rs/rick-and-morty/0.1.0)
