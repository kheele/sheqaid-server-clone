const findByIdImpl = require('../findByIdImpl');
const listByLoggedImpl = require('../listByLoggedImpl');
const {getVariablesAndQueryConfig} = require("./commons");
const createImpl = require("../createImpl");
const updateImpl = require("../updateImpl");
const {findClientByContractorEmail, checkDuplicateClientByContractorEmail, findByIdClient, checkClientExistById} = require("./query_clients");

const args = {
	name: "Clients",
	tbl: "default_clients",
	details_fragment: `
		id
        created_at
        name
        address
        contractor_email
        email
        phone
        profile_pic
        linked_contractor {
            id
            name
            username
        }
        module_list {
            id
            price
            module {
                id
                borderColor
                desc
                discount
                faIconLeft
                faIconRight
                has_update
                hover
                key
                price
                sort
                status
                svgIconLeft
                svgIconRight
                title
                plugin{
                	key
                }
            }
        }
        sector_list{
            id
            sector {
                id
                name
            }
        }
        project_list{
            id
            name
            site_list {
                id
                name
            }
        }
        site_list{
            id
            name
        }
        project_list_aggregate {
            aggregate {
                count
            }
        }
        site_list_aggregate {
            aggregate {
                count
            }
        }
        contractor_list_aggregate {
            aggregate {
                count
            }
        }
        user_list_aggregate {
            aggregate {
                count
            }
        }
        employee_list_aggregate {
            aggregate {
                count
            }
        }
        team_list_aggregate {
            aggregate {
                count
            }
        }
        incident_list_aggregate {
            aggregate {
                count
            }
        }
        training_matrix_list_aggregate {
            aggregate {
                count
            }
        }
        asset_list_aggregate {
            aggregate {
                count
            }
        }
	`,
	order_by: "order_by: {name: asc}",
	uploadUpdate: ({id}) => ({
		new_name: `clients/${id}/profile-pic`,
		key: 'profile_pic',
	}),
	getVariablesAndQueryConfig,
	orgs_fragment: `
		company {
			id
			name
		}
	`,
};

const path = 'clients';

eventManager.on(`${path}/create`, async (socket, input) => {
	const create = createImpl(args);

	const {
		name,
		business_id,
		phone,
		email,
		contractor_email,
		address,
		profile_pic,
		sector_list
	} = input;

	const loggedUser = await socket.getLoggedUser();
	if(!loggedUser) return;
	const { user:{id: user_id, company:{id: company_id}}} = loggedUser;
	input.user_id = user_id;
	input.company_id = company_id;

	if(contractor_email) {
		const existingItem = await findClientByContractorEmail(socket, contractor_email);
		if (existingItem) {
			return "DUP_CONTRACTOR_EMAIL";
		}
	}

	return create(socket, input);
});

eventManager.on(`${path}/update`, async (socket, input) => {
	const update = updateImpl(args);

	const {
		id,
		name,
		business_id,
		phone,
		email,
		contractor_email,
		address,
		profile_pic,
		sector_list
	} = input;

	const item = await checkClientExistById(socket, id);
	if (!item) return;

	if(contractor_email) {
		const existingItem = await checkDuplicateClientByContractorEmail(socket, {id, contractor_email});
		if (existingItem) {
			return "DUP_CONTRACTOR_EMAIL";
		}
	}

	return update(socket, input);
});

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));
