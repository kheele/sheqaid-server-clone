const createImpl = require("../../../createImpl");
const updateImpl = require("../../../updateImpl");
const {findByIdProxyIncidentInjury} = require("./queries_incidents_proxy_injuries");

const args = {
	name: "ProxyIncidentInjury",
	tbl: "proxy_incident__injury",
	details_fragment: `
		incident_id
		injury_id
	`,
};

const path = "incidents/proxy/injuries";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, async (socket, attrs) => {
	const {
		incident_id,
		injury_id,
		new_injury_id,
	} = attrs;

	delete attrs.incident_id;
	delete attrs.injury_id;

	const id = {
		incident_id,
		injury_id,
	};

	const item = await findByIdProxyIncidentInjury(socket, id);
	if (!item) return;

	attrs.injury_id = new_injury_id;

	const update = updateImpl(args);
	return update(socket, {id, ...attrs});
});
