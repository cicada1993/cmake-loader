import { loadCppTest } from "./wasmer";

loadCppTest().then(
    (cppTest) => {
        let { cppOpt, wasmer } = cppTest
        console.log('cppOpt', cppOpt)
        return wasmer()
    }
).then(
    (wasm) => {
        console.log('wasm', wasm)
    }
)