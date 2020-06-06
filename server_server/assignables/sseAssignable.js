const assignable = require("willcore.core/assignable/assignable");
const sseProxy = require("../proxies/sseProxy.js");
const serverProxy = require("willcore.server/proxies/server/serverProxy.js");
const sessionProxy = require("willcore.session/server_server/proxies/session/sessionProxy.js");
const sseContainer = require("../containers/sseContainer.js");

class sseAssignable extends assignable {
    constructor() {
        super({}, serverProxy);
        this.interceptors = {
            before: [],
            after: []
        };
        this.activationURL = "event-stream";
        this.sessionLogic = null;
        this.sseContainer = new sseContainer(this.sessionLogic);
    }

    completionResult() {
        let proxyResult = sseProxy.new(this);
        this.parentProxy._assignable.registerRequestProxy(this.activationURL, proxyResult);
        for (let parentAssignableName in this.parentProxy) {
            if (this.parentProxy[parentAssignableName] instanceof sessionProxy) {
                this.sessionLogic = this.parentProxy[this.parentProxy];
                break;
            }
        }
        if (!this.sessionLogic) throw "No session module was found on server.";

        return proxyResult;
    }

    //Method to be called to send event to the front-end
    sendEvent(id, eventName, message) {
        let responses = this.sseContainer.sseResponses[id];
        if (responses) {
            message = {
                event: eventName,
                payload: message
            };
            let result = `data: ${JSON.stringify(message)}\n\n`;
            responses.foreach((response) => {
                response.write(result);
            });
        }
    }

    /**
    * @param {import('../models/requestDetails.js').requestInstance} requestInfo 
    */
    async onRequest(requestInfo, request, response) { //Model to be created here and action called
        this.sseContainer.register(response, request);
        return true;
    }

    completed() {
    }
}

module.exports = sseAssignable;