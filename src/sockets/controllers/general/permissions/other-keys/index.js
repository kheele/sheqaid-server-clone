const listImpl = require('../../../modules/listImpl');

const args = {
	name: "PermissionOtherKeys",
	tbl: "sheq_permissions_other_keys",
	details_fragment: `
		id
        value
	`,
	orgs_fragment: null,
};

const path = "permissions/other-keys";

eventManager.on(`${path}/list`, listImpl(args));
