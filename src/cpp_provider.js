let cppTest

async function loadCppTest() {
    if (!cppTest) {
        const cppTestESM = await import("../cpptest")
        if (typeof cppTestESM.default == "function") {
            cppTest = await cppTestESM.default()
        } else {
            cppTest = await cppTestESM.default
        }
    }
    return cppTest
}

export {
    loadCppTest
}