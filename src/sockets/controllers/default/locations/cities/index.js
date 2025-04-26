const listImpl = require('../../../modules/listImpl');
const findByIdImpl = require('../../../modules/findByIdImpl');

const args = {
	name: "Cities",
	tbl: "default_cities",
	skipRemoved: true,
	details_fragment: `
		id
        name
	`,
	orgs_fragment: null,
	getVariablesAndQueryConfig: ({id, zone_id, country_iso2}) => {
		//<editor-fold desc="variables, filters">
		let filter = [];

		if (id) {
			filter.push(`id: {_eq: ${id}}`);
		} else {
			if (zone_id) {
				filter.push(`zone_id: {_eq: ${zone_id}}`);
			}
			if (country_iso2) {
				filter.push(`country_iso2: {_eq: "${country_iso2}"}`);
			}
		}

		filter = filter.join(',');
		//</editor-fold>

		return {filter};
	},
};

const path = "cities";

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/list`, listImpl({
	...args,
	limit: 0,
	order_by: "order_by: {name: asc}",
}));
//
