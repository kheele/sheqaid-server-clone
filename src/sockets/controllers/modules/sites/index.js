const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {site_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const createImpl = require("../createImpl");

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

const path = 'sites';

eventManager.on(`${path}/create`, async (socket, input) => {
	const create = createImpl(args);

	const loggedUser = await socket.getLoggedUser();
	if(!loggedUser) return;
	const { user:{id: user_id, company:{id: company_id}}} = loggedUser;
	input.user_id = user_id;
	input.company_id = company_id;

	return create(socket, input);
});

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listImpl({
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
