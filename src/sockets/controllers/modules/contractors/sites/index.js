const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {site_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "ContractorSites",
	tbl: "default_sites",
	details_fragment,
};

eventManager.on("contractors/sites/findById", findByIdImpl(args));

eventManager.on("contractors/sites/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
