const findByIdImpl = require("../../findByIdImpl");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const findImpl = require("../../findImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
    name: "Teams",
    tbl: "default_teams",
    details_fragment: `
        id
            created_at
            name
            status
            
            supervisor {
                id
                fname
                lname
                email
                phone
                job_position{
                    id
                    name
                }
            }
            
            employee_list_aggregate{
                aggregate{
                    count
                }
            }
            ppe_type_list_aggregate{
                aggregate{
                    count
                }
            }
    `,
    order_by: `{name: asc}`,
    getVariablesAndQueryConfig,
};

const path = 'teams';

eventManager.on(`${path}/create`, async (socket, input) => {
    const create = createImpl(args);

    const {
        employee_list
    } = input;

    if(employee_list) {
        delete input.employee_list;
    }

    const savedItem = await create(socket, input);
    if(savedItem) {
        if (employee_list) {
            await Promise.all(employee_list.data.map(async ({id}) => {
                return updateEmployee(({id, team_id: savedItem.id}));
            }));
        }

        const findById = findByIdImpl(args);
        return findById(socket, savedItem.id);
    }
});

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/findBy`, findImpl({
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

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));
