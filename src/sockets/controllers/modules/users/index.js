
const findByIdImpl = require("../findByIdImpl");
const listImpl = require('../listImpl');
const {user_details_fragment: details_fragment} = require("./commons");
const {user_personal_details_fragment} = require("../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require("./commons");
const {create} = require("./create");
const {update} = require("./update");
const {findByIdUser} = require("./query_users");

const args = {
	name: "User",
	tbl: "default_users",
	details_fragment,
	uploadUpdate: ({id}) => ({
		new_name: `users/${id}/profile-pic`,
		key: 'profile-pic',
	}),
};

const path = "users";

eventManager.on(`${path}/create`, create(args));

eventManager.on(`${path}/update`, update(args));

eventManager.on(`${path}/findById`, findByIdUser);

eventManager.on(`${path}/listByLogged`, listImpl({
	...args,
	order_by: `order_by: {lname: asc}`,
	details_fragment: user_personal_details_fragment,
	getVariablesAndQueryConfig,
}));
