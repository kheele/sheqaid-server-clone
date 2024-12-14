const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {
    ppe_type_one_details_fragment,
    ppe_type_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const findImpl = require("../../findImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
    name: "PPETypes",
    tbl: "ppe_types",
    details_fragment: ppe_type_one_details_fragment,
    order_by: `{name: asc}`,
    getVariablesAndQueryConfig,
    uploadUpdate: ({id}) => ({
        new_name: `ppes/${id}/ppe-doc`,
        key: 'profile_pic',
    }),
};

const path = 'ppe-types';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/findByClientIdAndName`, findImpl({
    ...args,
    where: ({data, filters}) => {
        const {
            name,
            //
            client_id,
            company_id,
            contractor_id,
            //
            incContractors,
            excContractors,
            exact_orgs,
            exact_orgs_company,
            //
            orgs_filter,
        } = data;

        let {filter} = filters;

        let newFilter = [];
        if (contractor_id) {
            newFilter.push(`{contractor_id:{_eq: ${contractor_id}}}`);
            if (client_id) {
                newFilter.push(`{client_id:{_eq: ${client_id}}}`);
            } else {
                newFilter.push(`{company_id:{_eq: ${company_id}}}`);
            }

            newFilter.push(`_or: [${newFilter.join(', ')}]`);
        } else if (client_id) {
            newFilter.push(`client_id:{_eq: ${client_id}}`);
        } else {
            newFilter.push(`company_id:{_eq: ${company_id}}`);
        }

        if(newFilter.isNotEmpty()) {
            newFilter = newFilter.join(', ');
            filter = filter ? `${filter}, ${newFilter}` : newFilter;
        }

        return filter;
    },
}));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: ppe_type_details_fragment,
}));
