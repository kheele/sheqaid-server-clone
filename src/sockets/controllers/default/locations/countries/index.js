const listImpl = require('../../../modules/listImpl');
const findByIdImpl = require('../../../modules/findByIdImpl');

const args = {
	name: "Countries",
	tbl: "default_countries",
	skipRemoved: true,
	details_fragment: `
		id
        name
        iso2
        phone_code
	`,
	orgs_fragment: null,
};

const path = "countries";

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/list`, listImpl({
	...args,
	limit: 0,
	order_by: "order_by: {name: asc}",
}));
//
