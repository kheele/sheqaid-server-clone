const createImpl = require("../../../createImpl");
const updateImpl = require("../../../updateImpl");

const args = {
	name: "ProxyIncidentSector",
	tbl: "proxy_sector__incident",
	details_fragment: `
		id
	`,
};

const path = "incidents/proxy/sectors";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));
