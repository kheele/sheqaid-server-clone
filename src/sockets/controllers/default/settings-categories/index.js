const listImpl = require('../../modules/listImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const {settings_categories_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "SettingsCategory",
	tbl: "settings_categories",
	details_fragment,
	orgs_fragment: null,
};

const path = "settings-categories";

eventManager.on(`${path}/findById`, findByIdImpl({
	...args,
}));

eventManager.on(`${path}/listAll`, listImpl({
	...args,
	order_by: "order_by: {key: asc}",
	getVariablesAndQueryConfig,
}));
//
