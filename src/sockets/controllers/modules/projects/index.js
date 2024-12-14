const findByIdImpl = require('../findByIdImpl');
const listByLoggedSkipRemovedImpl = require('../listByLoggedSkipRemovedImpl');
const {details_fragment, getVariablesAndQueryConfig} = require("./commons");
const createImpl = require("../createImpl");
const updateImpl = require("../updateImpl");

const args = {
	name: "Projects",
	tbl: "default_projects",
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
	`,
};

const path = 'projects';

eventManager.on(`${path}/create`, async (socket, input) => {
	const create = createImpl(args);

	const loggedUser = await socket.getLoggedUser();
	if(!loggedUser) return;
	const { user:{id: user_id, company:{id: company_id}}} = loggedUser;
	input.user_id = user_id;
	input.company_id = company_id;

	return create(socket, input);
});

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedSkipRemovedImpl({
	...args,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
	orgs_filter: async (socket, data) => {
		const is = await socket.is();
		if (!is) return;

		const {isConsultant, isNoProjects, isContractorView} = is;
		const decodedIdToken = await socket.getDecodedIdToken();
		if (!decodedIdToken) return;

		const {
			company_id,
			my_client,
			my_project,
			my_site,
			contractor_id,

			selected_client_id,
			selected_project_id,
			selected_site_id,
			logged_contractor_id,

			selected_contractor_client_id,
			selected_contractor_site_id,

			// access_type,
			// loggedUser: {user: {id: user_id}},
		} = decodedIdToken;

		if (my_site) {
			return [`site_list: {id: {_eq: ${my_site.id}}}`];
		}
		if (my_project) {
			return [`id: {_eq: ${my_project.id}}`];
		}
		if (my_client) {
			return [`client_id: {_eq: ${my_client.id}}`];
		}

		if (isConsultant) {
			if (selected_client_id) {
				return [`client_id: {_eq: ${selected_client_id}}`];
			}
			return [];
		} else if(!isNoProjects) {//client with projects

		}

		return [`company_id: {_eq: ${company_id}}`];
	},
}));
