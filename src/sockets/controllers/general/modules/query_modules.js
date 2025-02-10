const listImpl = require("../../modules/listImpl");
const {details_fragment_modules: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
    name: "Modules",
    tbl: "default_manager_module",
    details_fragment,
    skipRemoved: true,
    orgs_fragment: null,
};

//<editor-fold desc="listAllModules">
exports.listAllModules = async (socket) => {
    const list = listImpl({
        ...args,
        order_by: "order_by: {sort: asc}",
        getVariablesAndQueryConfig,
    });
    return list(socket);
};
//</editor-fold>

//<editor-fold desc="listClientInstalledPermissionModules">
exports.listClientInstalledPermissionModules = listClientInstalledPermissionModules = async (socket) => {
    const list = listImpl({
        ...args,
        order_by: "order_by: {sort: asc}",
        getVariablesAndQueryConfig,
    });
    return list(socket, {
        status: "Installed",
        plugin_status: "Installed",
        plugin_key: "!plugin_admin",
    });
};
//</editor-fold>

//<editor-fold desc="listClientInstalledPermissionModulesAsNewPermissions">
exports.listClientInstalledPermissionModulesAsNewPermissions = async (socket) => {
    return listClientInstalledPermissionModules(socket).then(res => {
        if(!res) return null;

        return res.map(({id}) => {
            return {module_id: id, actions: {data: {create: true, view: true, edit: true, remove: true, share: true}}};
        });
    });
};
//</editor-fold>
