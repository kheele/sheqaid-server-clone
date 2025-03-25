const findByIdImpl = require("../../findByIdImpl");
const findImpl = require("../../findImpl");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
    name: "JobPositions",
    tbl: "default_job_positions",
    details_fragment: `
        id
            created_at
            name
            desc
            doc
            job_position_owner
            employee_list_aggregate{
                aggregate{
                    count
                }
            }
            employee_external_list_aggregate{
                aggregate{
                    count
                }
            }
            ppe_type_list_aggregate{
                aggregate{
                    count
                }
            }
            toolbox_talk_list_aggregate{
                aggregate{
                    count
                }
            }
            training_plan_list_aggregate{
                aggregate{
                    count
                }
            }
            job_category {
                id
                name
            }
    `,
    order_by: `{name: asc}`,
    uploadUpdate: ({id}) => ({
        new_name: `job-positions/${id}/job-position-doc`,
        key: 'doc',
    }),
    getVariablesAndQueryConfig,
};

const path = 'job-positions';

eventManager.on(`${path}/create`, async (socket, input) => {
    const create = createImpl(args);

    const loggedUser = await socket.getLoggedUser();
    if(!loggedUser) return;
    const { user:{id: user_id}, company:{id: company_id}} = loggedUser;
    input.user_id = user_id;
    input.company_id = company_id;

    return create(socket, input);
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

