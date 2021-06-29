const path = require('path')
const fs = require('fs')
const { getOptions } = require('loader-utils')
const { cmakeBuild } = require('./tool')
const { version } = require('webpack')

// this loader handles file end with .cm.js  
// .cm.js is a describer for cmake project but also a plain js module
// so you should declare a loader such as 
// inline way   import { cppOpt, wasmer, workerIns } from "cmake-loader!../cpptest"
// or write some config like in webpack.config.js
// .cm.js supports 5 properties for now
/**
 * name —— name of wasm file or binder js must be same as product in `add_executable(product main.cpp)`
 * favor —— type of cmake project two types for now: webassembly project、c project
 * asModule —— binder js will export a function for loading wasm
 * asWorker —— binder js will be a worker  
 * cache —— building cmake project may take a while  enable it for building faster
 */
module.exports = function (source) {
    this.cacheable()
    const cppOpt = require(this.resourcePath)
    console.log('cmake project options', cppOpt)
    // 默认配置
    const defaultLoaderOpt = {}
    const loaderOpt = Object.assign(
        {

        },
        defaultLoaderOpt,
        getOptions(this)
    )
    console.log('cmake loader options', loaderOpt)

    const callback = this.async()
    // dir of .cm.js
    const sourceDir = path.resolve(this.resourcePath, "..")
    // name of wasm file or binder js
    const fileName = cppOpt.name
    const wasmPath = path.resolve(sourceDir, `./build/${fileName}.wasm`)
    // return js code for next step
    const handleRet = () => {
        if (cppOpt.favor == "wasm") {
            // a  webassembly cmake project 
            // emit a wasm file to webpack output dir
            fs.readFile(wasmPath, (err, data) => {
                this.emitFile(`${fileName}.wasm`, data)
            })
            let codeArr = []
            codeArr.push(`const cppOpt = ${JSON.stringify(cppOpt)}`)
            if (cppOpt.asModule) {
                codeArr.push(`import * as wasmer from './build/${fileName}.js'`)
                // if (cppOpt.asWorker) {
                //      // in this mode wasmer is valid but workerIns cannot be created because worker code is run in a function
                //     // and it is strange that onmessage will receive a message {type:'webpackOk'}
                //     // so we ignore this case
                //     //webpack version compatibility
                //     if (version.startsWith('5.')) {
                //         codeArr.push(`const workerIns = new Worker(new URL('./build/${fileName}.js', import.meta.url))`)
                //     } else {
                //         codeArr.push(`import Worker from 'worker-loader!./build/${fileName}.js'
                //         const workerIns = new Worker()`)
                //     }
                // } else {
                //     // in this mode workerIns is null
                //     codeArr.push(`const workerIns = null`)
                // }
                codeArr.push(`const workerIns = null`)
            } else {
                codeArr.push(`const wasmer = null`)
                if (cppOpt.asWorker) {
                    // in this mode wasmer is null
                    //webpack version compatibility
                    if (version.startsWith('5.')) {
                        codeArr.push(`const workerIns = new Worker(new URL('./build/${fileName}.js', import.meta.url))`)
                    } else {
                        codeArr.push(`import Worker from 'worker-loader!./build/${fileName}.js'
                        const workerIns = new Worker()`)
                    }
                } else {
                    // in this mode both wasmer and workerIns are null
                    // just run binder js and load wasm file
                    codeArr.push(`import './build/${fileName}.js'`)
                    codeArr.push(`const workerIns = null`)
                }
            }
            codeArr.push(`export {cppOpt,wasmer,workerIns}`)
            let genCode = codeArr.join("\n")
            console.log('-----------------genCode----------------')
            console.log(genCode)
            console.log('-----------------genCode end----------------')
            callback(null, genCode)
        } else {
            // a non webassembly cmake project 
            // just back source in .cm.js file
            let genCode = `const cppOpt = ${JSON.stringify(cppOpt)}
            const wasmer = null
            const workerIns = null
            export {cppOpt,wasmer,workerIns}`
            callback(null, genCode)
        }
    }
    // 先编译再返回
    const cppBuildConfig = {
        dir: sourceDir,
        favor: cppOpt.favor,
        emsdk: loaderOpt.emsdk
    }
    if (cppOpt.favor == 'wasm' && cppOpt.cache && fs.existsSync(wasmPath)) {
        console.log('cmake-loader', 'hit cache result')
        handleRet()
    } else {
        console.log('cmake-loader', 'compiling cmake project')
        // 构建配置
        cmakeBuild(cppBuildConfig, (res) => {
            handleRet()
        })
    }
}