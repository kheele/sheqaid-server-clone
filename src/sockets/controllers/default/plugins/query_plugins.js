const listImpl = require("../../modules/listImpl");
const {details_fragment_plugins: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
    name: "Plugins",
    tbl: "default_manager_plugin",
    details_fragment,
    skipRemoved: true,
    orgs_fragment: null,
};

//<editor-fold desc="listAllPlugins">
exports.listAllPlugins = async (socket) => {
    const list = listImpl({
        ...args,
        order_by: "order_by: {title: asc}",
        getVariablesAndQueryConfig,
    });
    return list(socket);
};
//</editor-fold>

//<editor-fold desc="listAllClientPlugins">
exports.listAllClientPlugins = async (socket) => {
    const list = listImpl({
        ...args,
        order_by: "order_by: {title: asc}",
        getVariablesAndQueryConfig,
    });
    return list(socket);
};
//</editor-fold>
