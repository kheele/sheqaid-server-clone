const createImpl = require("../../../createImpl");
const updateImpl = require("../../../updateImpl");
const {findByIdProxyIncidentCategory} = require("./queries_incidents_proxy_categories");

const args = {
	name: "ProxyIncidentCategory",
	tbl: "proxy_incident__category",
	details_fragment: `
		incident_id
		category_id
	`,
};

const path = "incidents/proxy/categories";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, async (socket, attrs) => {
	const {
		incident_id,
		category_id,
		new_category_id,
	} = attrs;

	delete attrs.incident_id;
	delete attrs.category_id;

	const id = {
		incident_id,
		category_id,
	};

	const item = await findByIdProxyIncidentCategory(socket, id);
	if (!item) return;

	attrs.category_id = new_category_id;

	const update = updateImpl(args);
	return update(socket, {id, ...attrs});
});
