const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {project_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const createImpl = require("../createImpl");

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

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
