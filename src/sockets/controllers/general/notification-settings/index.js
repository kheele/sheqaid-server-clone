const listImpl = require('../../modules/listImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const findImpl = require('../../modules/findImpl');
const {settings_categories_details_fragment: details_fragment} = require("./commons");
const updateImpl = require("../../modules/updateImpl");
const deleteImpl = require("../../modules/deleteImpl");

const args = {
	name: "NotificationSettings",
	tbl: "settings_categories",
	details_fragment,
	orgs_fragment: null,
};

const path = "notification-settings";

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

eventManager.on(`${path}/delete`, deleteImpl({
	...args,
}));

eventManager.on(`${path}/findById`, findByIdImpl({
	...args,
}));

eventManager.on(`${path}/listByLogged`, async (socket, data) => {
	const {
		key,
		user_id,
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
				notifications_settings: {${key}: {_eq: true}}
			`;
		},
		order_by: `order_by: {lname: asc}`,
		getVariablesAndQueryConfig: ({orgs_filter}) => ({
			filter: orgs_filter.join(','),
		}),
	});

	return list(socket, data);
});
//
