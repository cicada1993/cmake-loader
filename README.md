# cmake-loader
- a webpack loader for building cmake project
- support building webassembly cmake project with emscripten on windows or linux

![image](https://user-images.githubusercontent.com/31173307/120924480-8af56000-c706-11eb-9116-fab18d01b909.png)

## requirements
- windows or linux
- mingw gcc on windows / gcc on linux
- cmake
- emscripten
## install loader
```
npm install cmake-loader --save-dev
```
## write a .cm.js file in root dir of cmake project
```
module.exports = {
    name: "cpptest",
    favor: "wasm", 
    asModule: true, 
    asWorker: false,
    cache: false
}
```
 - name —— name of wasm file or binder js must be same as productName in `add_executable(productName main.cpp)`
 - favor —— type of cmake project two types for now: webassembly project、c project
 - asModule —— binder js will export a function for loading wasm
 - asWorker —— binder js will be a worker  
 - cache —— building cmake project may take a while  enable it for building faster

## best webassembly practice for .cm.js file
- favor ——"wasm"
- asModule ——true
- asWorker ——false
- cache ——true

then you can use your wasm module in a common js file or a woker js like main.js and cppwk.js 
## for webpack—— config webpack.config.js
```
resolve: {
    extensions: ['.js', '.json', '.wasm', '.ts', '.cm.js'],
},
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /\.cm.js$/
        },
        {
            test: /\.cm.js$/,
            use: {
                loader: 'cmake-loader',
                options: {
                    emsdk: {
                        win32: "D:\\emsdk", // change into yourself's
                        linux: "/home/kotlinrust/Apps/emsdk" // change into yourself's
                    }
                }
            }
        }
    ]
},
```
- emsdk
    - win32 set the emsdk path installed on windows
    - linux set the emsdk path installed on linux
## for vue-cli —— config vue.config.js
```
lintOnSave: false, // avoid building failed
configureWebpack: (config) => {
    config.resolve.extensions.push('.cm.js')
},
chainWebpack(config) {
    config.module
    .rule('cmake')
    .test(/\.cm\.js$/)
    .use('cmake-loader')
    .loader('cmake-loader')
    .tap(options => {
        return {
            emsdk: {
                win32: "D:\\emsdk",  // change into yourself's
                linux: "/home/kotlinrust/Apps/emsdk" // change into yourself's
            }
        }
    })
    .end();
    config.module.rule('js').exclude.add(/\.cm\.js$/); 
}
```
if you use vue cli,wasm file may loaded failed because of .wasm file and binder js are not in same dir,you can fixed it by passing a object with locatFile function to wasmer
```
import { cppOpt, wasmer, workerIns } from "../cpptest"
if (wasmer) {
    wasmer({locateFile:(path, scriptDirectory)=>path}).then(
        (wasm) => {
            console.log('cppwk wasm', wasm)
        }
    )
}else {
    
}
```
you can trace this error by viewing binder js code,you will find that:
```
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}
```
## example
```
npm run dev
```
