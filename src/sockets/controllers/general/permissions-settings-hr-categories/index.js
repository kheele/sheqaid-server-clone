const listImpl = require('../../modules/listImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const {settings_categories_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "NotificationSettingsCategory",
	tbl: "settings_categories",
	details_fragment,
	orgs_fragment: null,
};

const path = "permissions-settings-hr-categories";

eventManager.on(`${path}/findById`, findByIdImpl({
	...args,
}));

eventManager.on(`${path}/listAll`, async (socket, data) => {
	const {
		company_id,
		client_id,
	} = data;

	console.log(`${path}/listAll`, data)

	const list = listImpl({
		name: `User`,
		tbl: `default_manager_module`,
		details_fragment: `
			id
			title
			key
			manager_plugin_id
			plugin{
				id
			}
		`,
		orgs_fragment: null,
		where: ({data, filters}) => {
			const {
				removed = false,
			} = data;

			// console.log('data', data)

			const {filter} = filters;

			if(company_id === client_id) {
				return `
					status: {_eq: "Installed"},
					${filter},
					company_list: {company_id: {_eq: ${company_id}}}
				`;
			}
			if(client_id) {
				return `
					status: {_eq: "Installed"},
					${filter},
					company_list: {client_id: {_eq: ${client_id}}}
				`;
			}
			return `
				status: {_eq: "Installed"},
				${filter},
				company_list: {company_id: {_eq: ${company_id}}}
			`;
		},
		order_by: `order_by: {title: asc}`,
		getVariablesAndQueryConfig: ({orgs_filter}) => ({
			filter: `plugin:{key:{_eq: "plugin_hr_management"}}`,
		}),
	});

	return list(socket, data);
});
//
