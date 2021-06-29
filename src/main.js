import { cppOpt, wasmer, workerIns } from "../cpptest"
if (wasmer) {
    wasmer().then(
        (wasm) => {
            console.log('wasm', wasm)
        }
    )
}
if (workerIns) {
    console.log('worker', workerIns)
    workerIns.postMessage({ type: 'greet' })
}

const cppWorker = new Worker(new URL('./cppwk.js', import.meta.url));
console.log('cppWorker', cppWorker)
cppWorker.postMessage({ type: "greet" })

