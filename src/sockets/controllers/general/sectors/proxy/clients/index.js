const createImpl = require("../../../../modules/createImpl");
const updateImpl = require("../../../../modules/updateImpl");
const deleteImpl = require("../../../../modules/deleteImpl");

const args = {
	name: "ProxySectorClient",
	tbl: "proxy_sector__client",
	details_fragment: `
		sector_id
		client_id
	`,
};

const path = "sectors/proxy/clients";

eventManager.on(`${path}/create`, createImpl({
	...args,
	orgs_fragment: null,
	skipOrgs: true,
	skipUsers: true,
}));

eventManager.on(`${path}/update`, updateImpl({
	...args,
	orgs_fragment: null,
}));

eventManager.on(`${path}/delete`, deleteImpl({
	...args,
	orgs_fragment: null,
}));
