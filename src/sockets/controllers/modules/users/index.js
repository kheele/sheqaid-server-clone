const listImpl = require('../listImpl');
const {user_details_fragment: details_fragment} = require("./commons");
const {user_personal_details_fragment} = require("../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require("./commons");
const {createUser} = require("./create");
const {updateUser} = require("./update");
const {findByIdUser} = require("./query_users");

const args = {
	name: "User",
	tbl: "default_users",
	details_fragment,
};

const path = "users";

eventManager.on(`${path}/create`, createUser);

eventManager.on(`${path}/update`, updateUser);

eventManager.on(`${path}/findById`, findByIdUser);

eventManager.on(`${path}/listByLogged`, listImpl({
	...args,
	order_by: `order_by: {lname: asc}`,
	details_fragment: user_personal_details_fragment,
	getVariablesAndQueryConfig,
}));
