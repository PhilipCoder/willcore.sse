module.exports = (service, server, willcore) => {
    service.authenticate.action.post = async (model) => {
        model.user.authenticate({ id: model.id });
        model.message = "You are logged in";
    };
    service.isAuthenticated.action.get = async (model) => {
        model.isAuth = model.user.authenticated;
    };
    service.blocked.action.get = async (model) => {
        model.message = "You are allowed";
    };
    service.blocked.before.authorize;

    service.logout.action.post = async (model) => {
        model.user.remove();
        model.message = "Logged out";
    };

    service.message.action.post = async (model) => {
        server.ui.sseContainer.emit(model.id,"message",model.message);
    };
};