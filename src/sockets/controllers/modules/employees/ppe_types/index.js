const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {
    ppe_type_one_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const findImpl = require("../../findImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
    name: "PPETypes",
    tbl: "ppe_types",
    details_fragment: `
        id
          created_at
          removed
          name
          unit
          duration_type
          duration_value
          notes
          profile_pic
        
          ppe_item_list_aggregate{
            aggregate {
              count
            }
          }
          employee_list_aggregate{
            aggregate {
              count
            }
          }
          team_list_aggregate{
            aggregate {
              count
            }
          }
          department_list_aggregate{
            aggregate {
              count
            }
          }
          job_position_list_aggregate{
            aggregate {
              count
            }
          }
    `,
    order_by: `{name: asc}`,
    getVariablesAndQueryConfig,
};

const path = 'ppe-types';

eventManager.on(`${path}/create`, async (socket, input) => {
    const create = createImpl({
        ...args,
        details_fragment: ppe_type_one_details_fragment,
    });

    const loggedUser = await socket.getLoggedUser();
    if (!loggedUser) return;
    const {user: {id: user_id, company: {id: company_id}}} = loggedUser;
    input.user_id = user_id;
    input.company_id = company_id;

    return create(socket, input);
});

eventManager.on(`${path}/update`, updateImpl({
    ...args,
    details_fragment: ppe_type_one_details_fragment,
}));

eventManager.on(`${path}/findById`, findByIdImpl({
    ...args,
    details_fragment: ppe_type_one_details_fragment,
}));

eventManager.on(`${path}/findByClientIdAndName`, findImpl({
    ...args,
    details_fragment: ppe_type_one_details_fragment,
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

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));
