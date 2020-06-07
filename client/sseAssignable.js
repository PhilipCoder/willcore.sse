import { assignable } from "/willcore/assignable/assignable.js"
import { uiProxy } from "/uiModules/proxies/ui/uiProxy.js";
import { guid } from "/uiModules/helpers/guid.js";
import { eventProxy } from "/uiModules/proxies/event/eventProxy.js";
import { sseProxy } from "./sseProxy.js";

class component extends assignable {
    constructor() {
        super({}, uiProxy);
        this.eventProxyInstance = eventProxy.new(guid());
        this.eventSource = null;
        if (typeof (EventSource) === "undefined") {
            console.log("SSE not supported");
        }
    }

    static get noValues() {
        return uiProxy;
    }

    completionResult() {
        let isConnected = false;
        let sseFunction = () => {
            this.eventSource = new EventSource("/event-stream");
            let eventProxyInstance = this.eventProxyInstance;
            eventProxyInstance.sseConnected = true;
            let errorCount = 0;
            isConnected = true;
            this.eventSource.onmessage = (event) => {
                console.log(event);
                if (event.type === "keepAlive") return;
                let eventData = JSON.parse(event.data);
                eventProxyInstance[event.type] = eventData;
            };
            this.eventSource.onerror = (error, aa) => {
                errorCount++;
                if (errorCount > 1) {
                    isConnected = false;
                    eventProxyInstance.sseError = error;
                    eventProxyInstance.sseConnected = false;
                }
            };
            this.eventSource.onopen = () => {
                errorCount = 0;
                isConnected = true;
                eventProxyInstance.sseConnected = true;
            };
        };
        this.eventProxyInstance.stopSSE = () => {
            if (this.eventSource) {
                this.eventSource.close();
                this.eventSource = null;
                isConnected = false;
            }
        };
        this.eventProxyInstance.requestSSEStatus = () => {
            this.eventProxyInstance.sseConnected = isConnected;
        };
        this.eventProxyInstance.startSSE = sseFunction;
        let proxyInstance = sseProxy.new(this.parentProxy, this.propertyName, this);
        return proxyInstance;
    }

    completed() {
    }
}

export { component };
