const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {
	ppe_item_details_fragment: details_fragment,
	ppe_item_one_details_fragment,
	getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");

const args = {
	name: "PPEItems",
	tbl: "ppe_items",
};

const path = 'ppe-items';

eventManager.on(`${path}/create`, async (socket, input) => {
	const create = createImpl(args);

	const loggedUser = await socket.getLoggedUser();
	if(!loggedUser) return;
	const { user:{id: user_id, company:{id: company_id}}} = loggedUser;
	input.user_id = user_id;
	input.company_id = company_id;

	return create(socket, input);
});

eventManager.on(`${path}/findById`, findByIdImpl({
	details_fragment: ppe_item_one_details_fragment,
	...args,
}));

eventManager.on(`${path}/listByLogged`, listImpl({
	...args,
	details_fragment,
	orgs_fragment: null,
	order_by: "order_by: {ppe_type:{name: asc}}",
	getVariablesAndQueryConfig,
}));
//
