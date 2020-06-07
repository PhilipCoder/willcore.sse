const assignable = require("willcore.core/assignable/assignable");
const sseProxy = require("../proxies/sseProxy.js");
const uiProxy = require("willcore.ui/server/proxies/uiProxy.js");
const sessionProxy = require("willcore.session/server_server/proxies/session/sessionProxy.js");
const sseContainer = require("../containers/sseContainer.js");
const path = require("path");

class sseAssignable extends assignable {
    constructor() {
        super({}, uiProxy);
        this.interceptors = {
            before: [],
            after: []
        };
        this.activationURL = "event-stream";
        this.sessionLogic = null;
    }

    completionResult() {
        let proxyResult = sseProxy.new(this);
        let serverProxy = this.parentProxy._assignable.parentProxy;
        serverProxy._assignable.registerRequestProxy(this.activationURL, proxyResult);
        for (let parentAssignableName in serverProxy) {
            if (serverProxy[parentAssignableName] instanceof sessionProxy) {
                this.sessionLogic = serverProxy[parentAssignableName];
                break;
            }
        }
        if (!this.sessionLogic) throw "No session module was found on server.";
        this.sseContainer = new sseContainer(this.sessionLogic._assignable.sessionLogic);
        this.registerSSEFileService();
        return proxyResult;
    }

    //Method to be called to send event to the front-end
    sendEvent(id, eventName, message) {
        let responses = this.sseContainer.sseResponses[id];
        if (responses) {
            // message = {
            //     event: eventName,
            //     payload: message
            // };
            let result = `event: ${eventName}\ndata: ${JSON.stringify(message)}\n\n\n`;
            responses.forEach((response) => {
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

    registerSSEFileService(){
        const serverProxy = this.parentProxy._assignable.parentProxy;
        let relativePath = this.getFilesFolderPath(serverProxy);
        serverProxy[this.propertyName].files = `${relativePath}`;
        this.parentProxy._assignable.addClientAssignable("sse",`/${this.propertyName}/sseAssignable.js`);
    }

    getFilesFolderPath(serverProxy) {
        let endPointFolder = path.normalize(`${__dirname}/../../client`);
        let mainExecutingDirectory = serverProxy._assignable.pathHelper.rootDirectory;
        let relativePath = path.relative(mainExecutingDirectory, endPointFolder);
        relativePath = "/" + relativePath.split("\\").join("/");
        return relativePath;
    }
}

module.exports = sseAssignable;