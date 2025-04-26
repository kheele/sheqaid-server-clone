const listByLoggedImpl = require('../../modules/listByLoggedImpl');
const {user_details_fragment: details_fragment} = require("./commons");
const {user_personal_details_fragment} = require("../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require("./commons");
const {createUser} = require("./create");
const {updateUser} = require("./update");
const {findByIdUser, loginUserStep1ByUsername, findByUsernameUserSetupBiometric} = require("./query_users");
const {signupUser} = require("./signup");
const {checkExistByUsername} = require("./query_users");

const args = {
	name: "User",
	tbl: "default_users",
	details_fragment,
};

const path = "users";

eventManager.on(`${path}/signup`, signupUser);

eventManager.on(`${path}/create`, createUser);

eventManager.on(`${path}/update`, updateUser);

eventManager.on(`${path}/findById`, findByIdUser);

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
	...args,
	order_by: `order_by: {lname: asc}`,
	details_fragment: user_personal_details_fragment,
	getVariablesAndQueryConfig,
}));

eventManager.on(`${path}/checkExistByUsername`, checkExistByUsername);

eventManager.on(`${path}/loginUserStep1ByUsername`, loginUserStep1ByUsername);

eventManager.on(`${path}/findByUsernameUserSetupBiometric`, findByUsernameUserSetupBiometric);