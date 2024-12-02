const listImpl = require('../../../modules/listImpl');
const findByIdImpl = require('../../../modules/findByIdImpl');
const findImpl = require("../../../modules/findImpl");
const updateImpl = require("../../../modules/updateImpl");

const path = "permissions-settings-hr";

eventManager.on(`${path}/create`, async (socket, data) => {
	const {
		key,
		// notification_settings_id,
		user_id,
	} = data;

	console.log(path, data);

	const find = findImpl({
		name: `NotificationSettings`,
		tbl: `notifications_settings`,
		details_fragment: `
			id
			${key}
			user_list{
				id
			}
		`,
		orgs_fragment: null,
		where: ({data, filters}) => {
			const {
				key,
				user_id,
			} = data;

			return `
				user_list: {id: {_eq: ${user_id}}}
			`;
		},
	});

	const res = await find(socket, data);

	console.log('find', res);

	const update = updateImpl({
		name: `NotificationSettings`,
		tbl: `notifications_settings`,
		details_fragment: `
			id
			${key}
			user_list{
				id
			}
		`,
		orgs_fragment: null,
	});

	const attrs = {
		id: res.id,
		[key]: true,
	};

	console.log('attrs', attrs);

	return update(socket, attrs);
});

// eventManager.on(`${path}/findById`, findByIdImpl({
// 	...args,
// }));

eventManager.on(`${path}/listByLogged`, async (socket, data) => {
	const {
		module_id,
		client_id,
	} = data;

	const list = listImpl({
		name: `User`,
		tbl: `default_users`,
		details_fragment: `
			id
			auth_id
			created_at
			fname
			lname
			full_name
			username
			phone
			profile_pic
		`,
		where: ({data, filters}) => {
			const {
				removed = false,
			} = data;

			const {filter} = filters;

			return `
				removed: {_eq: ${removed}},
				${filter},
				permissions_module_list: {
					module_id: {_eq: ${module_id}},
					actions:{_or:[{create:{_eq:true}},{edit:{_eq:true}},{view:{_eq:true}},{remove:{_eq:true}},]}
				}
			`;
		},
		order_by: `order_by: {lname: asc}`,
		getVariablesAndQueryConfig: ({orgs_filter}) => ({
			filter: orgs_filter.join(','),
		}),
	});
	// const list = listImpl({
	// 	name: `User`,
	// 	tbl: `default_manager_module`,
	// 	details_fragment: `
	// 		id
	// 		title
	// 		key
	// 		manager_plugin_id
	// 		plugin{
	// 			id
	// 		}
	// 	`,
	// 	orgs_fragment: null,
	// 	where: ({data, filters}) => {
	// 		const {
	// 			removed = false,
	// 		} = data;
	//
	// 		console.log('data', data)
	//
	// 		const {filter} = filters;
	//
	// 		if(company_id === client_id) {
	// 			return `
	// 				status: {_eq: "Installed"},
	// 				${filter},
	// 				company_list: {company_id: {_eq: ${company_id}}}
	// 			`;
	// 		}
	// 		if(client_id) {
	// 			return `
	// 				status: {_eq: "Installed"},
	// 				${filter},
	// 				company_list: {client_id: {_eq: ${client_id}}}
	// 			`;
	// 		}
	// 		return `
	// 			status: {_eq: "Installed"},
	// 			${filter},
	// 			company_list: {company_id: {_eq: ${company_id}}}
	// 		`;
	// 	},
	// 	order_by: `order_by: {title: asc}`,
	// 	getVariablesAndQueryConfig: ({orgs_filter}) => ({
	// 		filter: `plugin:{key:{_eq: "plugin_hr_management"}}`,
	// 	}),
	// });

	return list(socket, data);
});
//
