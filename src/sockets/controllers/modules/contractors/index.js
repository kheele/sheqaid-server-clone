require('./library');
require('./questionnaires');
require('./sites');
require('./template-categories');
require('./templates');
require('./users');

const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {contractor_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const {orgs_no_site_fragment} = require("../../../../graphql/Fragments");
const findByIdDashboardMainImpl = require("./findByIdDashboardMainImpl");
const findByIdDashboardSingleImpl = require("./findByIdDashboardSingleImpl");

const args = {
	name: "Contractors",
	tbl: "default_contractors",
	details_fragment,
	orgs_fragment: orgs_no_site_fragment,
};

eventManager.on("contractors/findById", findByIdImpl(args));

eventManager.on("contractors/listByLogged", listImpl({
	...args,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));

eventManager.on("contractors/main/dashboard", findByIdDashboardMainImpl);

eventManager.on("contractors/single/dashboard", findByIdDashboardSingleImpl);
