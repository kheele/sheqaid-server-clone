const createImpl = require("../../../createImpl");

const args = {
	name: "ProxyIncidentWitness",
	tbl: "proxy_incident__witness",
	details_fragment: `
		id
	`,
};

const path = "incidents/proxy/witnesses";

eventManager.on(`${path}/create`, createImpl(args));
