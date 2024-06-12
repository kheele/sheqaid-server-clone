
const findByIdImpl = require("../findByIdImpl");
const listImpl = require('./listImpl');
const {user_details_fragment: details_fragment} = require("./commons");

eventManager.on("users/findById", findByIdImpl({
	name: "User", tbl: "default_users", details_fragment,
}));

eventManager.on("users/listByLogged", listImpl);
