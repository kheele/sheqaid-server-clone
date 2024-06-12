const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const deleteImpl = require("../../deleteImpl");
const findByIdImpl = require("../../findByIdImpl");

const path = "ncr/proxy/document/";

const args = {
	name: "ProxyNCRDocument",
	tbl: "sheq_non_conformance_docs",
	details_fragment: `
		id
		non_conformance_id
		non_conformance{
			id
		}
		type
		doc
	`,
	orgs_fragment: null,
};

eventManager.on(`${path}create`, createImpl(args));

eventManager.on(`${path}update`, updateImpl(args));

eventManager.on(`${path}delete`, deleteImpl(args));

eventManager.on(`${path}findById`, findByIdImpl(args));