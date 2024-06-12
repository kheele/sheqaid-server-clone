const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {site_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "Sites",
	tbl: "default_sites",
	details_fragment,
	orgs_fragment: `
		company {
			id
			name
		}
		client {
			id
			name
		}
		project {
			id
			name
		}
	`,
};

eventManager.on("sites/findById", findByIdImpl(args));

eventManager.on("sites/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig: (
		{
			orgs_filter = [],
			//
			id,
			//
			name,
			//
			site_id, project_id, client_id,
			//
			exact_orgs = false,
		}
	) => {
		//<editor-fold desc="variables, filters">
		let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

		if (id) {
			filter.push(`id: {_eq: ${id}}`);
		} else {
			if (name) {
				filter.push(`name: {_ilike: "%${name}%"}`);
			}
		}

		filter = filter.join(',');
		//</editor-fold>

		return {filter};
	}
}));
//
