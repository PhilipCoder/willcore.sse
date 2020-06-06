const sseProxyHandler = require("./sseProxyHandler.js");
const requestProxy = require("willcore.server/proxies/request/requestProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class sseProxy extends requestProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<requestProxyHandler>}
     */
    static new(sseAssignable) {
        let result = new Proxy(new sseProxy(), new sseProxyHandler(sseAssignable));
        return result;
    }
}

module.exports = sseProxy;