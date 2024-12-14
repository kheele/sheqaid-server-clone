const findByIdImpl = require('../findByIdImpl');
const {details_fragment, getVariablesAndQueryConfig} = require("./commons");
const createImpl = require("../createImpl");
const listByLoggedImpl = require("../listByLoggedImpl");
const updateImpl = require("../updateImpl");

const args = {
	name: "Sectors",
	tbl: "default_sectors",
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

const path = 'sectors';

eventManager.on(`${path}/create`, async (socket, input) => {
	const create = createImpl(args);

	const is = await socket.is();
	if (!is) return;
	const decodedIdToken = await socket.getDecodedIdToken();
	if (!decodedIdToken) return;

	const {
		company_id,
		selected_client_id,
		selected_project_id,
		selected_site_id,
		logged_contractor_id
	} = decodedIdToken;

	const {isContractor} = is;

	const loggedUser = await socket.getLoggedUser();
	if(!loggedUser) return;
	const { user:{id: user_id}} = loggedUser;

	if(isContractor) {
		input.contractor_user_id = user_id;
	} else {
		input.user_id = user_id;
	}
	if(isContractor) {
		input.contractor_id = logged_contractor_id;
		input.company_id = 38;//TODO: THIS IS A HACK. THE COMPANY WITH THIS ID WAS CREATED ONLY TO ASSIGN CONTRACTORS DATA TO THE COMPANY. BECAUSE PGSQL THROWS NON-NULL ERROR.
		return;
	} else {
		input.company_id = company_id;
	}

	if (selected_client_id) {
		input.client_id = selected_client_id;
	}

	input.sector_owner = "Private";

	return create(socket, input);
});

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
	...args,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
