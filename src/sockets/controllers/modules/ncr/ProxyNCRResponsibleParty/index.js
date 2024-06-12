const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const deleteImpl = require("../../deleteImpl");
const findByIdImpl = require("../../findByIdImpl");

const path = "ncr/proxy/responsible-party/";

const args = {
	name: "ProxyNCRResponsibleParty",
	tbl: "sheq_non_conformance_responsible_parties",
	details_fragment: `
		id
		ncr_id
		ncr{
			id
		}
		value
	`,
	orgs_fragment: null,
};

eventManager.on(`${path}create`, createImpl(args));

eventManager.on(`${path}update`, updateImpl(args));

eventManager.on(`${path}delete`, deleteImpl(args));

eventManager.on(`${path}findById`, findByIdImpl(args));