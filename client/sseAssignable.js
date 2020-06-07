import { assignable } from "/willcore/assignable/assignable.js"
import { uiProxy } from "/uiModules/proxies/ui/uiProxy.js";
import { guid } from "/uiModules/helpers/guid.js";
import { eventProxy } from "/uiModules/proxies/event/eventProxy.js";

class component extends assignable {
    constructor() {
        super({ }, uiProxy);
        this._element = null;
        this.modalModel = null;
        this.eventProxyInstance = eventProxy.new(guid());
        this.eventSource = null;
        if (typeof(EventSource) === "undefined"){
            console.log("SSE not supported");
        }
    }

    static get noValues() {
        return uiProxy;
    }

    completionResult() {
        this.eventProxyInstance.startSSE = () =>{
            this.eventSource = new EventSource("/event-stream");
            this.eventSource = this.onEvent;
        };
        this.eventProxyInstance.stopSSE = () =>{
            if (this.eventSource){
                this.eventSource.close();
                this.eventSource = null;
            }
        };
        return false;
    }

    onEvent(event){
        let eventData = JSON.parse(event.data);
        this.eventProxyInstance[eventData.event] = eventData.payload;
    }

    completed() {
    }
}

export { component };
