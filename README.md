# WillCore.SSE

WillCore.SSE is a willcore module that enables the server to broadcast global events to a client. The module will override the authenticate function. This will now add a function where the session data will contain a sessionId. 


```javascript
module.exports = (service, server) => {
    //Action to authenticate and log a user in
    service.authenticate.action.post = async (model) => {
        if (model.password === "demoPassword" && model.email === "test@gmail.com"){
             model.user.authenticate({ id:1, email: "test@gmail.com" });//activates the sse for a session.
             model.message = "You are logged in";
        }else{
            model.message = "Invalid details provided.";
        }
    };
};
```


```javascript
//Defines and exports the service module and function
module.exports = (service, server, willcore) => {
    //Action to add data
    service.addData.action.post = async (model) => {
        let valueToAdd = model.data;
        //Code to add to database to go here
        model.message = "Successfully added entry to DB.";
        server.sse.fromServer.event = [{data:"message"}];//broadcast to current user.
        server.sse.fromServer.eventRemote = [{data:"message"}, 2];//broadcast to user with ID 2.
    };
};
```

Ping rate,30 sec
SSE will connect from the start.

### Connecting to SSE from front-end (requires an active session)

```javascript
let view = async (model, ui, requests, events) => {
    //Activating server-side events
    events.sseConnect = true;
}
export { view };
```

### Activating events client side

```javascript
let init = (willcore, service) => {
    willcore.ui;
    willcore.ui.sse;
};

export { init };
```