const findByIdImpl = require("../../findByIdImpl");
const listImpl = require("../../listImpl");

const {
	incident_injury_list_details_fragment,
	getVariablesAndQueryConfig
} = require("./commons");

const args = {
	name: "IncidentInjuryList",
	tbl: "sheq_incident_investigation_injury_list",
	details_fragment: incident_injury_list_details_fragment,
	order_by: `{name: asc}`,
	getVariablesAndQueryConfig,
};

const path = "incidents-injury-list";

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listImpl(args));
