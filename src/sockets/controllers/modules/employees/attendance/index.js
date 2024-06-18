
const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {
	ppe_type_details_fragment: details_fragment,
	ppe_type_one_details_fragment,
	getVariablesAndQueryConfig,
} = require("./commons");

const args = {
	name: "PPETypes",
	tbl: "ppe_types",
};

const path = "attendance"

eventManager.on("ppe-types/findById", findByIdImpl({
	details_fragment: ppe_type_one_details_fragment,
	...args,
}));

eventManager.on("ppe-types/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
