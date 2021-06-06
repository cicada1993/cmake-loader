let cppTest

async function loadCppTest() {
    if (!cppTest) {
        const cppTestESM = await import("../cpptest")
        cppTest = await cppTestESM.default()
    }
    return cppTest
}

export {
    loadCppTest
}