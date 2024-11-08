const listImpl = require('../../../modules/listImpl');
const findByIdImpl = require('../../../modules/findByIdImpl');

const args = {
    name: "Zones",
    tbl: "default_zones",
    skipRemoved: true,
    details_fragment: `
		id
        name
	`,
    orgs_fragment: null,
    getVariablesAndQueryConfig: ({id, country_iso2}) => {
        //<editor-fold desc="variables, filters">
        let filter = [];

        if (id) {
            filter.push(`id: {_eq: ${id}}`);
        } else {
            if (country_iso2) {
                filter.push(`country_iso2: {_eq: "${country_iso2}"}`);
            }
        }

        filter = filter.join(',');
        //</editor-fold>

        return {filter};
    },
};

const path = "zones";

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/list`, listImpl({
    ...args,
    limit: 0,
    order_by: "order_by: {name: asc}",
}));
