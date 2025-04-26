const findByIdImpl = require('./findByIdImpl');
const {details_fragment} = require("../../../../general/clients/commons");
const {createClient} = require("../../../../general/clients/create");
const {updateClient} = require("../../../../general/clients/update");
const {findByIdClient} = require("../../../../general/clients/query_clients");

eventManager.on("claims/clients/wcl6/findById", findByIdImpl);

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
