const requestProxyHandler = require("willcore.server/proxies/request/requestProxyHandler.js");

class sseProxyHandler extends requestProxyHandler {
  constructor(assignable) {
    super(assignable);
  }

  emit(target, property, proxy) {
    if (property === "emit") {
      let emit = (id, eventName, payload) => {
        proxy._assignable.sendEvent(id, eventName, payload);
      };
      target[property] = emit;
      return { value: emit, status: true }
    }
    return { value: false, status: false }
  }
}

module.exports = sseProxyHandler;