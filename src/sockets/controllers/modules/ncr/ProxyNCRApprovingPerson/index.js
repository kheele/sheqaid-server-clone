const {employee_basic_personal_details_fragment, personal_details_other_fragment} = require("../../../../../graphql/Fragments");

const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const deleteImpl = require("../../deleteImpl");
const findByIdImpl = require("../../findByIdImpl");

const path = "ncr/proxy/approving-person/";

const args = {
	name: "ProxyNCRApprovingPerson",
	tbl: "sheq_non_conformance_approving_persons",
	details_fragment: `
		id
		ncr_id
		ncr{
			id
		}
		employee_id
		employee{
			${employee_basic_personal_details_fragment}
		}
	`,
	orgs_fragment: null,
};

eventManager.on(`${path}create`, createImpl(args));

eventManager.on(`${path}update`, updateImpl(args));

eventManager.on(`${path}delete`, deleteImpl(args));

eventManager.on(`${path}findById`, findByIdImpl(args));