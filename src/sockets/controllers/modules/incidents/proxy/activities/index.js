const createImpl = require("../../../createImpl");
const updateImpl = require("../../../updateImpl");

const args = {
	name: "ProxyIncidentActivity",
	tbl: "proxy_incident__activity",
	details_fragment: `
		id
	`,
};

const path = "incidents/proxy/activities";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));
