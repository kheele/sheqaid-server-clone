const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require('../../listByLoggedImpl');
const {user_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const {orgs_contractor_fragment, user_personal_details_fragment} = require("../../../../../graphql/Fragments");
const {loginUserStep1ByUsername, findByUsernameUserSetupBiometric, checkExistByUsername} = require("./query_contractor_users");
const {createContractorUser} = require("./create");
const {updateContractorUser} = require("./update");
const {signupContractorUser} = require("./signup");

const args = {
	name: "ContractorUsers",
	tbl: "default_contractor_users",
	details_fragment,
	orgs_fragment: orgs_contractor_fragment,
};

const path = 'contractors/users';

eventManager.on(`${path}/signup`, signupContractorUser);

eventManager.on(`${path}/create`, createContractorUser);

eventManager.on(`${path}/update`, updateContractorUser);

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
	...args,
	order_by: `order_by: {lname: asc}`,
	details_fragment: user_personal_details_fragment,
	getVariablesAndQueryConfig,
}));

eventManager.on(`${path}/checkExistByUsername`, checkExistByUsername);

eventManager.on(`${path}/loginUserStep1ByUsername`, loginUserStep1ByUsername);

eventManager.on(`${path}/findByUsernameUserSetupBiometric`, findByUsernameUserSetupBiometric);
//
