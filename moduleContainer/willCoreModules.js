module.exports = (willCoreModuleInstance) => {
    willCoreModuleInstance.sse = () => require("../server_server/assignables/sseAssignable.js");
};