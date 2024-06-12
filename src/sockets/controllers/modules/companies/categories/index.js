const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {company_category_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "CompanyCategory",
	tbl: "default_company_categories",
	details_fragment,
};

eventManager.on("companies/categories/findById", findByIdImpl(args));

eventManager.on("companies/categories/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
