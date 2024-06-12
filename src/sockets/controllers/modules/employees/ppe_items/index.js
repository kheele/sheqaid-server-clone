const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {
	ppe_item_details_fragment: details_fragment,
	ppe_item_one_details_fragment,
	getVariablesAndQueryConfig,
} = require("./commons");

const args = {
	name: "PPEItems",
	tbl: "ppe_items",
};

eventManager.on("ppe-items/findById", findByIdImpl({
	details_fragment: ppe_item_one_details_fragment,
	...args,
}));

eventManager.on("ppe-items/listByLogged", listImpl({
	...args,
	details_fragment,
	orgs_fragment: null,
	order_by: "order_by: {ppe_type:{name: asc}}",
	getVariablesAndQueryConfig,
}));
//
