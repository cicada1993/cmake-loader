# cmake-loader
- this is a tool for webpack
- you can compile a wasm module from an cmake project with emscripten

![image](https://user-images.githubusercontent.com/31173307/120924480-8af56000-c706-11eb-9116-fab18d01b909.png)

## requirements
- windows or linux
- cmake
- emscripten
## install
```
npm install cmake-loader --save-dev
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
## webpack.config.js
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
## vue.config.js
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
## errors about wasm
if you use vue cli,wasm file may loaded failed,you can fix it as folowing in cpp_provider.js
```
let cppTest

async function loadCppTest() {
    if (!cppTest) {
        const cppTestESM = await import("../cpptest")
        if (typeof cppTestESM.default == "function") {
            cppTest = await cppTestESM.default({
                locateFile:(path, scriptDirectory)=> {
                    return path
                }
            })
        } else {
            cppTest = await cppTestESM.default
        }
    }
    return cppTest
}

export {
    loadCppTest
}
```
as for why,you can find following code in cpptest.js
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
