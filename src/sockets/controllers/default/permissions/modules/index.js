const upsertImpl = require('../../../modules/upsertImpl');

const args = {
    name: "PermissionModules",
    tbl: "sheq_permissions_modules",
    details_fragment: `
		id
        actions{
            id
            create
            edit
            view
            remove
            share
        }
        module{
            id
            key
            title
            plugin{
                id
                key
                desc
                status
                title
            }
        }
	`,
    orgs_fragment: null,
};

const path = "permissions/modules";

eventManager.on(`${path}/upsert`, async (socket, input) => {
    let {
        id,
        module,
        actions,
        user_id,
        // contractor_user_id,
    } = input;

    let attrs;

    if (id) {
        const upsert = upsertImpl({
            name: 'PermissionAction',
            tbl: 'sheq_permissions_actions',
            details_fragment: `
                id
                create
                edit
                view
                remove
                share
            `,
            orgs_fragment: null,
        });

        actions = await upsert(socket, actions);

        attrs = {id, actions_id: actions.id};
    } else {
        attrs = {
            actions: {data: actions},
            module_id: module.id,
            user_id,
            // contractor_user_id: ,
        };
    }

    const upsert = upsertImpl(args);
    return upsert(socket, {
        id, ...attrs,
    });
});
