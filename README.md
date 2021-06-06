# cmake-loader
- this is a tool for webpack
- you can compile a wasm module from an cmake project with emscripten
## requirements
- windows or linux
- cmake
- emscripten
## install
```
npm install cmake-loader --save-dev
```
## config webpack
```
see webpack.config.js
```
## write a file end with .cm.js as following
```
module.exports = {
    name: "cpptest",
    favor: "wasm",
    cache: true
}
```
- name declare cmake project name
- favor set cmake project output type
- cache enable cache mode for building a wasm
## example
```
npm run dev
```
