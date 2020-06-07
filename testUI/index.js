const view = async (model, ui, server, events) => {
    model.sessionData = {
        authenticated: false,
        sessionId: 1,
        connected: null
    };

    model.messageData = {
        targetSessionId:1,
        message:"",
        chat:""
    };

    const sessionData = await server.session.authenticated.get();
    model.sessionData.authenticated = sessionData.authenticated;
    model.sessionData.sessionId = sessionData.id || 1;

    model.$sessionIDInput.disabled = () => model.sessionData.authenticated;
    model.$setSessionBTN.disabled = () => model.sessionData.authenticated;
    model.$removeSessionBTN.disabled = () => !model.sessionData.authenticated;
    model.$sessionIDInput.model = () => model.sessionData.sessionId;

    model.$targetIDInput.model = () => model.messageData.targetSessionId;
    model.$messageInput.model = () => model.messageData.message;
    model.$chat.bind = () => model.messageData.chat;

    model.$setSessionBTN.onclick.event = async () => {
        await server.auth.authenticate.post({ id: model.sessionData.sessionId });
        model.sessionData.authenticated = true;
        events.startSSE = true;
    };

    model.$removeSessionBTN.onclick.event = async () => {
        await server.auth.logout.post();
        model.sessionData.authenticated = false;
    };

    model.$sendMessageBTN.onclick.event = async () =>{
        await server.auth.message.post({ id: model.messageData.targetSessionId, message: model.messageData.message });
    };

    if (model.sessionData.authenticated){
        events.startSSE = true;
    }

    events.message = (data) =>{
        model.messageData.chat = `${data}<br/>` + model.messageData.chat;
    };

    model.$disconnectedBadge.show = () => model.sessionData.connected === false;
    model.$connectedBadge.show = () => model.sessionData.connected === true;

    events.sseConnected = (connected) =>{
        model.sessionData.connected = connected;
    };
   events.requestSSEStatus = true;
};

export { view };