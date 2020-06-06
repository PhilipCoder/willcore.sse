const requestProxyHandler = require("willcore.server/proxies/request/requestProxyHandler.js");

class sseProxyHandler extends requestProxyHandler {
    constructor(assignable) {
      super(assignable);
    }
  }
  
  module.exports = sseProxyHandler;