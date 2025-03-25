const createImpl = require("../../../createImpl");
const updateImpl = require("../../../updateImpl");

const args = {
	name: "ProxyIncidentPersonInvolved",
	tbl: "proxy_incident__person_involved",
	details_fragment: `
		id
	`,
};

const path = "incidents/proxy/persons-involved";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));
