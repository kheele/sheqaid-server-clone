const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "CompanyCategory",
	tbl: "default_company_categories",
	details_fragment: `
		id
  		name
	`,
	orgs_fragment: null,
};

const path = 'companies/categories';

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/list`, listImpl({
	...args,
	order_by: "order_by: {name: asc}",
	skipRemoved: true,
	getVariablesAndQueryConfig,
}));
//
