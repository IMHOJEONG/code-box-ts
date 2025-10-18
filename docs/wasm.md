
- wasm-bindgen

https://rustwasm.github.io/docs/wasm-bindgen/reference/attributes/on-js-imports/js_namespace.html

- https://yceffort.kr/2022/03/rust-wasm-tutorial-3

### Rust로 SPA 만들기 

- https://ui.toast.com/weekly-pick/ko_20200818

- 웹 어셈블리 

    - https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Loading_and_running


--- 

- 이 ts에러도 찾아볼 것 

- Type instantiation is excessively deep and possibly infinite.ts(2589)

- supabase

- Errors
Exited with status 101
Standard Error
   Compiling playground v0.0.1 (/playground)
warning: variable does not need to be mutable
 --> src/main.rs:2:9
  |
2 |     let mut s = String::from("hi");
  |         ----^
  |         |
  |         help: remove this `mut`
  |
  = note: `#[warn(unused_mut)]` on by default

error[E0596]: cannot borrow `*text` as mutable, as it is behind a `&` reference
 --> src/main.rs:8:5
  |
8 |     text.push_str(" world");
  |     ^^^^ `text` is a `&` reference, so the data it refers to cannot be borrowed as mutable
  |
help: consider changing this to be a mutable reference
  |
7 | fn add_world(text: &mut String) {
  |                     +++

For more information about this error, try `rustc --explain E0596`.
warning: `playground` (bin "playground") generated 1 warning
error: could not compile `playground` (bin "playground") due to 1 previous error; 1 warning emitted
