const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {client_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

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

eventManager.on("clients/findById", findByIdImpl(args));

eventManager.on("clients/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));

eventManager.on("clients/listAll", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
}));
//
