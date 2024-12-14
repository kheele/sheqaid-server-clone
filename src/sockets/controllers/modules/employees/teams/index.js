const findImpl = require("../../findImpl");
const listByLoggedSkipRemovedImpl = require("../../listByLoggedSkipRemovedImpl");
const {getVariablesAndQueryConfig, teams_details_fragment, teams_details_one_fragment} = require("./commons");
const {findByIdTeam} = require("./query_teams");
const {createTeam} = require("./create");
const {updateTeam} = require("./update");

const args = {
    name: "Teams",
    tbl: "default_teams",
    details_fragment: teams_details_fragment,
    order_by: `{name: asc}`,
    getVariablesAndQueryConfig,
};

const path = 'teams';

eventManager.on(`${path}/create`, createTeam);

eventManager.on(`${path}/update`, updateTeam);

eventManager.on(`${path}/findById`, findByIdTeam);

eventManager.on(`${path}/findBy`, findImpl({
    ...args,
    details_fragment: teams_details_one_fragment,
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

        if (newFilter.isNotEmpty()) {
            newFilter = newFilter.join(', ');
            filter = filter ? `${filter}, ${newFilter}` : newFilter;
        }

        return filter;
    },
}));

eventManager.on(`${path}/listByLogged`, listByLoggedSkipRemovedImpl(args));
