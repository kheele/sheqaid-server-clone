const {user_personal_details_fragment} = require("../../../../../graphql/Fragments");

const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const deleteImpl = require("../../deleteImpl");
const findByIdImpl = require("../../findByIdImpl");

const path = "ncr/proxy/assigned-user/";

const args = {
	name: "ProxyNCRAssignedUser",
	tbl: "sheq_non_conformance_assignee_users",
	details_fragment: `
		id
		ncr_id
		ncr{
			id
		}
		user_id
		user{
			${user_personal_details_fragment}
		}
	`,
	orgs_fragment: null,
};

eventManager.on(`${path}create`, createImpl(args));

eventManager.on(`${path}update`, updateImpl(args));

eventManager.on(`${path}delete`, deleteImpl(args));

eventManager.on(`${path}findById`, findByIdImpl(args));