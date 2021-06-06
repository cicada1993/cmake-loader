import { loadCppTest } from "./cpp_provider";

loadCppTest().then(
    (cppTest) => {
        console.log('webassembly', cppTest)
    }
)