---
title: "Testing the waters - building a simple Rust library."
date: "2020-12-17"
description: "The not-so-steep uphill climb to building in Rust."
bannerImage: "media/trying-rust-lang/cargo.png"
tags:
  - "technology"
---

# Testing the waters - building a simple Rust Library.
Rust holds the crown for “most-loved” language for [5 years in a row](https://insights.stackoverflow.com/survey/2020#technology-most-loved-dreaded-and-wanted-languages)  according to the stack overflow survey - quite an impressive feat. I actually didn’t *know* Rust was this much beloved until I started writing this post and checked its position. I however, have been wanting to foray into development with WebAssembly (wasm) for sometime. JavaScript is a … nice language, but its got its rough edges. Rust probably has the widest ecosystem for building with WebAssembly. Its also probably one of the most suited of the more “grown up/popular enterprise” languagues like Java or C# (or even GoLang) since they all have garbage collectors and require at least some form of minimal run time to be packaged with the code in order to run. Compiled rust wasm will generally come out smaller than the alternatives since it has no garbage collector - and smaller is **always** better with web apps. 

Rust is like C++, but it makes it *much less* painful to deal with memory management and safety by doing all the work at **compile time**. Just thinking of the many times I’d get `segfaults` writing C++ in college… yikes. This is where Rust shines - while remaining as efficient as C++. I say “efficient”, without any numbers but Google “Rust” and the first sentence should be “Performance.” (Literally, that one-word sentence).

I have *attempted* to learn Rust before, but the first try left me very… confused. I was “fighting the borrow checker” (a key way Rust guarantees memory safety) so I sort of… ~~gave up~~ put it in the backlog - to later try again. Knowing that I wanted to do something (anything) with Rust, my first goal was finding out an “Hello World” program. It was mostly by chance, but I found [yew](https://yew.rs) on [the "realworld" repo](https://github.com/gothinkster/realworld). 
Yew was fairly straightforward to get started with. There’s a sample app in the documentation that I was able to run within minutes. The framework is component based so coming from mostly React, I felt at home - at least from a high level. Components have state and receive props from their parents. I highly recommend reading the yew docs if curious. The documenation is solid. (A very common theme in Rust-land).  

What I really wanted to do is create an app that does something a little more than static text, maybe call an API and update the UI based on the response. 
So, I decided to create a clone of [rickandmortyapi.com](https://rickandmortyapi.com) with Yew. Now, I don’t think one should reach for Yew just to build a web app that calls an api and writes the response. (You could get away with **no framework** and just write a few lines JavaScript). But this was a happy medium for me, especially since I didn’t have a computationally complex problem to solve at the moment.
I used [create yew app](https://github.com/jetli/create-yew-app) to bootstrap a new app and created an (ugly) clone.

The end result is [here](http://old-test.surge.sh). 
Here's a snippet of a component method (`rendered`) that's called at every render (a `useEffect` for React devs). 
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

The code may or may not look foreign, one major highlight from this is [pattern matching](#pattern-matching). 
The code would not compile if the error branch was not handled. Seemingly trivial but, I think its one of those guard rails thats really protecting the programmer from self inflicted pain.

The `rick_and_morty` crate was added after finishing the yew app and realising it should be easy to refactor and publish the functionality as library (I noticed Rust was missing from the helper libraries available).

I am so surprised at how easy it was for me to create a library in Rust. Really, why isn’t every other language like this? So even though, this journey started with me wanting to learn Rust by writing a WebAssembly app; It ended with me publishing a [rick_and_morty crate](https://crates.io/crates/rick-and-morty) in Rust (and absolutely loving the entire process).

- - - -

## Thoughts

### Editor Support:

I was hoping to find a dedicated IDE for Rust. It seems like it would benefit a lot from having a full-fledged environment (like Goland). But, there is a pretty solid [extension](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust) for VS Code. I was not expecting anything impressive. VSCode is, a code *editor* at the end of the day. And it especially seems to struggle with everything that’s not JavaScript or TypeScript. My main issue is how it slows down with larger codebases, “Go To Definition” sometimes refusing to work. But alas, this extension was … really good. I think an IDE will do even better (and I’m hoping an IntelliJ-like thing comes out eventually). The main issues I ran into were (rare) occasions where hovering a function, struct, method would not show the proper documentation for it, and trying to go to the definition would also fail. Also, lint and error checking always take an extra second to show after saving. So it always feels like the editor is trying to catch up to me. However, once linting and compiling is done, and the messages do show up in the editor— wow, I don’t think I’ve worked with a compiler as helpful as Rust’s.

### Compiler Messages
Rust’s compiler errors and warnings are probably the most pleasant part of working in Rust for me. I don’t remember the compiler being this friendly the first time I tried Rust (3-ish years ago). It points out exactly where something’s gone wrong and, often, even suggests *how* to fix it. 
This is an example of one such message that shows in VSCode:
<media-box src="media/trying-rust-lang/rust-compiler-message.png" name="A very helpful message from the Rust compiler."></media-box>
I can’t stress enough just how much easier this makes things - and this is possibly the most trivial example. There are also a *lot* of compiler flags to warn/error on things like unused imports/dead code, and even fail on missing documentation! Ok maybe, there’s another platform that does it and I don’t know about it (Go’s `fmt` and `godoc` are pretty good too) but I think Rust`s approach just makes it so … approachable 😉.

### Automatic Life Time Checking. 
I won’t write too much on this as I am definitely not an expert. But I want to point it out because understanding it is important to write just about any Rust code. It’s how Rust makes sure references that are no longer used get discarded (and discarded references are *never* used). 
I didn’t find it too hard to wrap my head around this - even though it was my point of failure the first time I tried rust. It’s like learning how scopes work and then turning it up to 11. I recommend reading the Rust book’s [primer](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)

### Pattern Matching.
After working with Rust’s `Option` and `Result` types. Going back to writing JavaScript feels like regression. 
Rust has a `match` expression which is like a `switch` statement (or `if/else` ) in most languages. Except it *makes* you write code better. A lot better.
Things like `switch` fall-through - which, you know, why? WHY do so many languages have switch statements fall through by default?? (and *require* you use to a `break` - leading to weird bugs in code, because a switch branch is missing a `break`). No more dealing with all that non-sense. `match` to the rescue! What I like the most about `match` is the exhaustiveness of it. If you switch over an enumeration of 3 possible values. And then later the enum is extended to 4. In most languages, the previous code would still work (but could potentially be buggy because of a missing case). With `match` - that missing case is a compile error! These are the kind of edge cases you’d need unit tests for — and now they’re free.
This really shines when dealing with an `Option`. A wrapper for something that could have a `Some(value)` or be `None`. `match`  forces you to write the code to handle both cases. Everytime. So you’ll never accidentally pass a `None` to a place that can’t handle it! (No more `null pointer exceptions`) The same for `Result` (like in the sample code). Ensuring an error is **always** handled. There’s some helper methods for working with these types. But the general rule is: you won’t unintentionally lose and edge case. This is great. It actually frees up more mental real state knowing the compiler has your back that way. 

### Package Management (Cargo, crates.io, docs.rs)
Dealing with webpack has to be one of the last things I ever want to do when working in a large JavaScript code base. It’s like its deliberately designed to be complex (complicated?) and intimidating. I mean, I get that its actually solving a problem but, its a pain. CLI tools like vue, angular and create-react-app have made things a lot easier but - those are all framework specific. So whenever there’s a need to do something the defaults aren’t designed for - well, that becomes a rabbit hole. Cargo is what I *expect* a package manager to look like. There’s commands for everything from creating a new rust library or binary, running tests, generating docs, building the code, packaging *and* publishing. 

Knowing the process was so straightforward (and very well documented) motivated me to create a new library (`cargo new --lib {lib name}`) and publish it on (`cargo publish`) [crates.io](https://crates.io/crates/rick-and-morty) and have the documentation automatically generated on[docs.rs](https://docs.rs/rick-and-morty/0.1.0/rick_and_morty/) (with a viewable local version through `cargo docs`) . I did across about 3 days in spare time. From scratch, learning the language, ecosystem and publishing a package. That’s not something I think is easily done is many other languages. The actual library (and what it does), I don’t think is impressive. But how the entire process worked - makes me feel like I can more easily build something in Rust, and not feel like I’m fighting everything else along the way. 

Rust is a relatively new language compared - everything else I am comparing it to like Python, JavaScript, C/C++; even GoLang is older (and Go probably excels to some extent on the same things mentioned). So it has had the chance to learn from all the bad decisions (and boy does JavaScript have a lot of those) - and really do things right. It excels at `It Just Works`™ . And for that, I am glad. I can’t wait to figure out *what* to do with all this `power`. 

As a disclaimer here: I’ve only spent a few days with Rust, there are a ton more stuff that Rust offers that I haven’t tried yet. So the Rust expert, forgive my naiveté. 

My wishlist for Rust long-term:
- A solid cross platform sdk for building native apps. I generally prefer the speed of native apps versus electron-based apps. But there really aren't a lot of great alternative to electron and JavaScript here (ie. VSCode's unimpressive handling of large files vs Sublime). I think Rust would be a perfect fit.
- Native DOM apis for wasm. Right now, wasm apps regardless of the language the wasm bundle is written in, still depend on the JS dom api for making changes to UI. So technically, they're not yet any faster than JavaScript. That will (hopefully) eventually change. And when it does; I think the web will become an even more platform for building... everything.


- - - -
## References:
- [Yew](https://yew.rs)
- [Create Yew App](https://github.com/jetli/create-yew-app)
- [rickandmortyapi.com](https://rickandmortyapi.com)
- [rick-and-morty rust library code](https://github.com/dshomoye/rick-and-morty)
- [rick-and-morty crate](https://crates.io/crates/rick-and-morty)
- [docs for crate](https://docs.rs/rick-and-morty/0.1.0)
