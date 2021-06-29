import { cppOpt, wasmer, workerIns } from "../cpptest"
if (wasmer) {
    wasmer().then(
        (wasm) => {
            console.log('cppwk wasm', wasm)
        }
    )
}else {
    
}

self.onmessage = (evt) => {
    console.log('receive message', evt)
}