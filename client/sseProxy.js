import { sseHandler } from "./sseProxyHandler.js";
import { assignableProxyHandler } from "/willcore/proxies/base/assignableProxyHandler.js";

/**
 * Proxy class for the main intermediate assignable instanciation.
 */
class sseProxy extends assignableProxyHandler{
    constructor(assignable){
        super(assignable);
    }
   /**
    * Factory method.
    * @param {Proxy} parentProxy 
    * @param {String} parentProperty 
    */
    static new(parentProxy, parentProperty,assignable){
        return new Proxy(new sseProxy(), new sseHandler(parentProxy,parentProperty,assignable));
    }
}

export { sseProxy };