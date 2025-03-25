const createImpl = require("../../../createImpl");
const updateImpl = require("../../../updateImpl");

const args = {
	name: "ProxyIncidentDistribution",
	tbl: "proxy_incident__distribution",
	details_fragment: `
		id
	`,
};

const path = "incidents/proxy/distributions";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));
