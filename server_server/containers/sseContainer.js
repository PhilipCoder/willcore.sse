class sseContainer {
    constructor(sessionLogic) {
        this.sseResponses = {};
        this.sessionLogic = sessionLogic;
        this.keepAliveTimeout = 60000;
    }

    register(response, request) {
        let sessionObject = this.sessionLogic.getCookieObject(request, response);
        if (!sessionObject || !sessionObject.id) return false;
        request.ended = true;//keeps the request from ending.
        let sessionId = sessionObject.id;
        this.sseResponses[sessionId] = this.sseResponses[sessionId] || [];
        this.sseResponses[sessionId].push(response);
        //writes the head
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            'Connection': 'keep-alive',
            'transfer-encoding': ''
        });
        //set the timeout
        setTimeout(() => {
            let responseList = this.sseResponses[sessionId];
            if (responseList) {
                delete this.sseResponses[sessionId];
                responseList.forEach(responseItem => {
                    responseItem.end("Keep Alive");
                });
            }
        }, this.keepAliveTimeout);
    }
}

module.exports = sseContainer;