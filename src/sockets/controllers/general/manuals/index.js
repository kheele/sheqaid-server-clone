const listImpl = require('../../modules/listImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const {manual_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "Manuals",
	tbl: "manuals",
	details_fragment,
	orgs_fragment: null,
};

eventManager.on("manuals/findById", findByIdImpl({
	...args,
}));

eventManager.on("manuals/listAll", listImpl({
	...args,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
