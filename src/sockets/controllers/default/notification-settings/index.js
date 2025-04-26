const listImpl = require('../../modules/listImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const updateImpl = require("../../modules/updateImpl");
const deleteImpl = require("../../modules/deleteImpl");
const upsertImpl = require("../../modules/upsertImpl");

const args = {
    name: "NotificationSettings",
    tbl: "notifications_settings",
    details_fragment: `
		id
	`,
    orgs_fragment: null,
};

const path = "notification-settings";

eventManager.on(`${path}/upsert`, async (socket, data) => {
    let {
        user_id,
        contractor_user_id,
        input: key,
        notifications_settings,
    } = data;

    if (notifications_settings) {
        const attrs = {[key]: action === 'ADDED'};
        notifications_settings = {id: notifications_settings.id, ...attrs};
    } else {
        notifications_settings = {
            [key]: action === 'ADDED',
        };
    }

    const upsert = upsertImpl(args);
    const item = await upsert(socket, notifications_settings);
    if (item) {
        if (!notifications_settings.id) {//for insertion
            const update = updateImpl({
                name: "Users",
                tbl: user_id ? "default_users" : "default_contractor_users",
                details_fragment: `
                    id
                `,
            });

            await update(socket, {id: user_id || contractor_user_id, notifications_settings_id: item.id});

            const findById = findByIdImpl(args);
            return findById(socket, item.id);
        }
    }
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
