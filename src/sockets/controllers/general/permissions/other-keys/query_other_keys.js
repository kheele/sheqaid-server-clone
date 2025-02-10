const listImpl = require("../../../modules/listImpl");

const args = {
    name: "PermissionOtherKeys",
    tbl: "sheq_permissions_other_keys",
    details_fragment: `
		id
        value
	`,
    skipRemoved: true,
    orgs_fragment: null,
};

//<editor-fold desc="listAllPermissionOtherKeys">
exports.listAllPermissionOtherKeys = async (socket) => {
    const list = listImpl({
        ...args,
    });
    return list(socket);
};
//</editor-fold>

//<editor-fold desc="listAllPermissionOtherKeysAsNewPermissions">
exports.listAllPermissionOtherKeysAsNewPermissions = async (socket) => {
    const list = listImpl({
        ...args,
    });
    return list(socket).then(res => {
        if(!res) return null;

        return res.map(({id}) => {
            return {key_id: id, actions: {data: {create: true, edit: true, view: true, remove: true, share: true}}};
        });
    });
};
//</editor-fold>
