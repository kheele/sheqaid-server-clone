require('./library');
require('./questionnaires');
require('./sites');
require('./template-categories');
require('./templates');
require('./users');

const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {contractor_details_fragment, getVariablesAndQueryConfig} = require("./commons");
const {orgs_no_site_fragment} = require("../../../../graphql/Fragments");
const findByIdDashboardMainImpl = require("./findByIdDashboardMainImpl");
const findByIdDashboardSingleImpl = require("./findByIdDashboardSingleImpl");
const {createContractor} = require("./create");
const {updateContractor} = require("./update");
const {findByOTPContractor, sendContractorOTP, findByUsernameContractor} = require("./query_contractors");

const args = {
	name: "Contractors",
	tbl: "default_contractors",
	details_fragment: contractor_details_fragment(),
	orgs_fragment: orgs_no_site_fragment,
};

const path = 'contractors';

eventManager.on(`${path}/create`, createContractor);

eventManager.on(`${path}/update`, updateContractor);

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listImpl({
	...args,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));

eventManager.on(`${path}/main/dashboard`, findByIdDashboardMainImpl);

eventManager.on(`${path}/single/dashboard`, findByIdDashboardSingleImpl);

eventManager.on(`${path}/single/dashboard`, findByIdDashboardSingleImpl);

eventManager.on(`${path}/otp/findBy`, findByOTPContractor);

eventManager.on(`${path}/otp/update`, sendContractorOTP);

eventManager.on(`${path}/username/findBy`, findByUsernameContractor);
