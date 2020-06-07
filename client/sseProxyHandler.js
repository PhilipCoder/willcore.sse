import { assignableProxyHandler } from "/willcore/proxies/base/assignableProxyHandler.js";

class sseHandler extends assignableProxyHandler {
    constructor(parentProxy,parentProperty,assignable) {
        super(assignable);
    }
}

export { sseHandler };