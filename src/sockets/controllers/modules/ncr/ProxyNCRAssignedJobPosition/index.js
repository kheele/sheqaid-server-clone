const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const deleteImpl = require("../../deleteImpl");
const findByIdImpl = require("../../findByIdImpl");

const path = "ncr/proxy/assigned-job-position/";

const args = {
	name: "ProxyNCRAssignedJobPosition",
	tbl: "sheq_non_conformance_assignee_job_positions",
	details_fragment: `
		id
		ncr_id
		ncr{
			id
		}
		job_position_id
		job_position{
			id
			name
			job_category{
				id
				name
			}
		}
	`,
	orgs_fragment: null,
};

eventManager.on(`${path}create`, createImpl(args));

eventManager.on(`${path}update`, updateImpl(args));

eventManager.on(`${path}delete`, deleteImpl(args));

eventManager.on(`${path}findById`, findByIdImpl(args));