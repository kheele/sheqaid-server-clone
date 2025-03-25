const findByIdImpl = require('../../findByIdImpl');
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const deleteImpl = require("../../deleteImpl");

const args = {
	name: "AuditDefinition",
	tbl: "sheq_compliance_audits_definitions",
	details_fragment: `
	  id
	  title
	  desc
	`,
	orgs_fragment: null,
};

const path = "audits/definitions";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/delete`, deleteImpl(args));
