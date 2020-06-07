<p align="center">
<img src="res/WillCoreLogo.png"  />
<h1 align="center">WillCore.SSE</h1>
<h5 align="center">Build With Proxies - By Philip Schoeman</h5>
<h5 align="center">License : MIT</h5>
</p>


WillCore.SSE is an expanstion module for WillCore.UI that enables server-side events. It allows you to emit front-end events from server-side code. The module is built on top and requires the folowing WillCore modules in order to work:

* WillCore.Server
* WillCore.UI
* WillCore.Session

WillCore.SSE integrates with the global event system available in WillCore.UI. Events can be sent to an active session. One session can emit events to another session by that session's ID. Server-side events can be used to update the front-end when something happens on the server, an example of this will be a chat application. Server-side events is an alternative to websockets.

## Getting Started

The SSE module can be installed on an existing project using NPM:

```javascript
npm install willcore.sse
```

The SSE module has to be activated both server-side and client-side. It is an assignable on the UI proxy.

#### Activating SSE server-side

```javascript
 willcore.serverInstance.ui.sseContainerName.sse;
```

### __SSE assignable (server-side)__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ✔    | None          |  SSEProxy     | UIProxy


The sseContainerName is the name of the SSE container. This will be the property where the container instance will be available to emit events on.

```javascript
//Full example:
const willCoreProxy = require("willcore.core");
willcore.testServer.server[__dirname] = 8581;
willcore.testServer.http;
willcore.testServer.user.session;
willcore.testServer.ui;
willcore.testServer.ui.sseContainer.sse;
```

#### Activating SSE client-side

Client side activating is done in the app.js file

```javascript
 willcore.ui.sse;
```

### __SSE assignable (client-side)__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ❌    | None          |  None     | UIProxy

```javascript
//Full example
let init = (willcore, service) => {
    willcore.ui;
    willcore.ui.sse;
};

export { init };
```

## SSE Enabled Sessions

To emit an event to a session, a session has to contain an identification field (id) in the session object. This can be the primary key of the user or another identifier to identify the user.

#### Create a session with an ID

```javascript
//Account service
module.exports = (service, server, willcore) => {
    //Authentication action
    service.authenticate.action.post = async (model) => {
        //Creates a session with an identification field.
        model.user.authenticate({ id: model.id });
    };
};
```

## Emitting Events To An Session

A function "emit" will be available on the SSE container proxy that can be used to emit events to a session.

#### Emit Function Parameters

Parameter Index | Parameter Name | Parameter Type | Description
--------------- | -------------- | -------------- | -----------
1 | Target Session ID | Number or String | The ID of the target session.
2 | Event Name | String | The name of the event that will be emitted to the session.
3 | Event Data | Object, Number or String | The event data that will be send via the SSE to the target session's front-end.

#### Example action that emits an event to a target session

```javascript
//Message service
module.exports = (service, server, willcore) => {
    //Action to send message
    service.sendMessage.action.post = async (model) => {
        server.ui.sseContainer.emit(model.targetId,"message",model.message);
    };
};
```

### Listing To Events

The SSE events will present themselves as global WillCore.UI events. The event name will be the same as the event name the event is submitted as. To start the SSE engine, an event with data of value true should be emitted to the startSSE event.

#### Example view that listens to the message event emitted in the example above.

```javascript
//View function
const view = async (model, ui, server, events) => {
    //Start the SSE engine
    events.startSSE = true;
    events.message = (data) =>{
        console.log(`A message is received from the server: ${data}`);
    };
};

export { view };
```

> #### Please note that the user must be authenticated with a valid session before SSE events can be received.

### Connected And Disconnected Status

An event "sseConnected" will be emitted when the SSE connection is connected to the server or when the connection is dropped form the server. This will happen when the server is offline or the connection is dropped. The data of the event will be a boolean indicating if the connection is connected or not.

#### Example to log to the console when the connection is dropped or connected

```javascript
//View function
const view = async (model, ui, server, events) => {
    //Start the SSE engine
    events.startSSE = true;
    events.sseConnected = (connected) =>{
        if (connected){
            console.log("SSE is connected.");
        }else{
            console.log("SSE is disconnected.");
        }
    };
};

export { view };
```

The sseConnected event can be forced by emitting an "requestSSEStatus" event.