const createImpl = require("../../../createImpl");
const updateImpl = require("../../../updateImpl");
const {findByIdProxyIncidentSubCategory} = require("./queries_incidents_proxy_sub_categories");

const args = {
	name: "ProxyIncidentSubCategory",
	tbl: "proxy_incident__sub_category",
	details_fragment: `
		incident_id
		sub_category_id
	`,
};

const path = "incidents/proxy/sub-categories";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, async (socket, attrs) => {
	const {
		incident_id,
		sub_category_id,
		new_sub_category_id,
	} = attrs;

	delete attrs.incident_id;
	delete attrs.sub_category_id;

	const id = {
		incident_id,
		sub_category_id,
	};

	const item = await findByIdProxyIncidentSubCategory(socket, id);
	if (!item) return;

	attrs.sub_category_id = new_sub_category_id;

	const update = updateImpl(args);
	return update(socket, {id, ...attrs});
});
