require('./proxy');

const findByIdImpl = require('../../modules/findByIdImpl');
const {details_fragment, getVariablesAndQueryConfig, details_public_fragment} = require("./commons");
const listByLoggedImpl = require("../../modules/listByLoggedImpl");
const listImpl = require("../../modules/listImpl");
const updateImpl = require("../../modules/updateImpl");
const {createSector} = require("./create");

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
    getVariablesAndQueryConfig,
    order_by: "order_by: {name: asc}",
};

const path = 'sectors';

eventManager.on(`${path}/create`, createSector);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    where: ({data, filters}) => {
        const {filter} = filters;

        return `
            sector_owner: {_eq: "Private"},
			${filter},
		`;
    },
}));

eventManager.on(`${path}/public/list`, listImpl({
    ...args,
    details_fragment: details_public_fragment,
    orgs_fragment: null,
    where: ({data, filters}) => `
        sector_owner: {_eq: "Public"},
        parent_id: {_is_null: true}
    `,
}));
