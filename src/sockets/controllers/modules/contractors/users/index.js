const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {user_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const {orgs_contractor_fragment} = require("../../../../../graphql/Fragments");

const args = {
	name: "ContractorUsers",
	tbl: "default_contractor_users",
	details_fragment,
	orgs_fragment: orgs_contractor_fragment,
};

eventManager.on("contractors/users/findById", findByIdImpl(args));

eventManager.on("contractors/users/listByLogged", listImpl({
	...args,
	order_by: `order_by: {lname: asc}`,
	getVariablesAndQueryConfig,
}));
//
