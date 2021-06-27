const path = require('path')
const fs = require('fs')
const { getOptions } = require('loader-utils')
const { cmakeBuild } = require('./tool')

// cmake-loader 处理 以.cm.js结尾的模块 它仍然是js模块 注意webpack.config.js中的配置
// .cm.js模块目前设定为一个普通js对象 主要内容为cmake模块相关的信息 以供cmake-loader处理 包含如下属性
/**
 * name cmake构建输出的文件名 
 * favor 输出类型 可选值 wasm 表示构建webassembly模块 构建输出的wasm文件和js胶水文件 均以name值命名
 * cache 输出类型为wasm时的缓存机制 如果对应的wasm文件存在 则不会重新构建 直接返回
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
    // .cm.js文件所在目录
    const sourceDir = path.resolve(this.resourcePath, "..")
    // 文件名
    const fileName = cppOpt.name
    const wasmPath = path.resolve(sourceDir, `./build/${fileName}.wasm`)
    // webpack loader 返回操作
    const handleRet = () => {
        if (cppOpt.favor == "wasm") {
            // emit wasm file to webpack output dir
            fs.readFile(wasmPath, (err, data) => {
                this.emitFile(`${fileName}.wasm`, data)
            })
            // return created code
            let genCode = `import * as wasmer from './build/${fileName}.js'
                    let cppOpt = ${JSON.stringify(cppOpt)}
                    export {cppOpt,wasmer}`
            callback(null, genCode)
        } else {
            // just back source in .cm.js file
            let genCode = `let cppOpt = ${JSON.stringify(cppOpt)}
            export {cppOpt}`
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