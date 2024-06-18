const createImpl = require('../../modules/createImpl');
const deleteImpl = require('../../modules/deleteImpl');
const listImpl = require('../../modules/listImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const {settings_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "Settings",
	tbl: "settings",
	details_fragment,
};

const path = "settings";

eventManager.on(`${path}/create`, createImpl({
	...args,
}));

eventManager.on(`${path}/delete`, deleteImpl({
	...args,
}));

eventManager.on(`${path}/findById`, findByIdImpl({
	...args,
}));

eventManager.on(`${path}/listByLogged`, listImpl({
	...args,
	order_by: "order_by: {settings_user: {lname: asc}}",
	getVariablesAndQueryConfig,
}));
//
