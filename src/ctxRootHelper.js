module.exports = function getCtxRoot(ctxRoot) {
    if (!ctxRoot.startsWith("/")) {
        ctxRoot = "/" + ctxRoot;
    }
    if (!ctxRoot.endsWith("/")) {
        ctxRoot = ctxRoot + "/";
    }
    return ctxRoot;
}