require('./categories');

const findByIdImpl = require('../../modules/findByIdImpl');
const listImpl = require('../../modules/listImpl');
const {company_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "Company",
	tbl: "default_companies",
	details_fragment,
};

eventManager.on("companies/findById", findByIdImpl(args));

eventManager.on("companies/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
