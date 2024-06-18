
const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {
	job_observation_type_details_fragment: details_fragment,
	job_observation_type_one_details_fragment,
	getVariablesAndQueryConfig,
} = require("./commons");

const args = {
	name: "JobObservationTypes",
	tbl: "job_observation_types",
};

const path = "job-observation-types";

eventManager.on(`${path}/findById`, findByIdImpl({
	details_fragment: job_observation_type_one_details_fragment,
	...args,
}));

eventManager.on(`${path}/listByLogged`, listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
