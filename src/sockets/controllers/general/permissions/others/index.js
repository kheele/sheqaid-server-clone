const upsertImpl = require('../../../modules/upsertImpl');

const args = {
    name: "PermissionOthers",
    tbl: "sheq_permissions_other",
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
      	key{
			id
			value
      	}
	`,
    orgs_fragment: null,
};

const path = "permissions/others";

eventManager.on(`${path}/upsert`, async (socket, input) => {
    let {
        id,
        actions,
        key,
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
            key_id: key.id,
            user_id,
            // contractor_user_id: ,
        };
    }

    const upsert = upsertImpl(args);
    return upsert(socket, {
        id, ...attrs,
    });
});
