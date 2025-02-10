const listByLoggedSkipRemovedImpl = require('../listByLoggedSkipRemovedImpl');
const {details_fragment, getVariablesAndQueryConfig} = require("./commons");
const {findByIdClient} = require("./query_clients");
const {createClient} = require("./create");
const {updateClient} = require("./update");

const args = {
    name: "Clients",
    tbl: "default_clients",
    details_fragment,
    orgs_fragment: `
		company {
			id
			name
		}
	`,
};

const path = 'clients';

eventManager.on(`${path}/create`, createClient);

eventManager.on(`${path}/update`, updateClient);

eventManager.on(`${path}/findById`, findByIdClient);

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
            return [`project_list: {id: {_eq: ${my_project.id}}}`];
        }
        if (my_client) {
            return [`id: {_eq: ${my_client.id}}`];
        }

        return [`company_id: {_eq: ${company_id}}`];
    },
}));
