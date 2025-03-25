const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const deleteImpl = require("../../deleteImpl");
const findByIdImpl = require("../../findByIdImpl");

const args = {
	name: "NCRProgress",
	tbl: "sheq_non_conformance_progress",
	details_fragment: `
		id
		outstanding
		notes
		date
	`,
	orgs_fragment: null,
};

const path = "ncr/progress";

eventManager.on(`${path}create`, createImpl(args));

eventManager.on(`${path}update`, updateImpl(args));

eventManager.on(`${path}delete`, deleteImpl(args));

eventManager.on(`${path}findById`, findByIdImpl(args));