
const findByIdImpl = require("../findByIdImpl");
const listImpl = require('../listImpl');
const {user_details_fragment: details_fragment} = require("./commons");
const {user_personal_details_fragment} = require("../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "User",
	tbl: "default_users",
};

eventManager.on("users/findById", findByIdImpl({
	...args,
	details_fragment,
}));

eventManager.on("users/listByLogged", listImpl({
	...args,
	order_by: `order_by: {lname: asc}`,
	details_fragment: user_personal_details_fragment,
	getVariablesAndQueryConfig,
}));
