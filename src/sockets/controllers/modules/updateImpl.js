const findByIdImpl = require("./findByIdImpl");

//<editor-fold desc="updateImpl">
module.exports = (config) => {
    return async (socket, attrs) => {
        if (!attrs) return;

        let {
            name,
            tbl,
            details_fragment,
            orgs_fragment,
            uploadUpdate,
        } = config;

        console.log('updateImpl:', attrs);
        const { id } = attrs;
        delete attrs.id;

        const auth = socket ? await socket.getAuth() : null;

        const findById = findByIdImpl({
            name,
            tbl,
            details_fragment,
            orgs_fragment,
        })

        let savedItem = await findById(socket, id);
        if (!savedItem) return;

        if (uploadUpdate && isFunction(uploadUpdate)) {
            const { new_name, new_names, key, keys } = uploadUpdate(savedItem);
            const { id } = savedItem;
            if (keys) {
                await Promise.all(keys.map(async (key, n) => {
                    const __new_name = new_names ? new_names[n] : new_name;
                    await upload({attrs, id, tbl, new_name: __new_name, name, key});
                }));
                savedItem = await whenFileReady(socket, savedItem, findById, keys);
            } else {
                const __new_name = new_names ? new_names[0] : new_name;
                await upload({attrs, id, tbl, new_name: __new_name, name, key});
                savedItem = await whenFileReady(socket, savedItem, findById, [key]);
            }
        }

        savedItem = await updateGraphQL({
            mutation: `
                mutation update${name}Mutation($id: ${tbl}_pk_columns_input!, $_set: ${tbl}_set_input!) {
                    update_${tbl}_by_pk(pk_columns: $id, _set: $_set) {
                        id
                    }
                }
            `,
            operationName: `update${name}Mutation`,
            id,
            attrs,
            auth,
        });

        if (savedItem) {
            return findById(socket, savedItem.id);
        }
    };
};
//</editor-fold>

async function upload({attrs, id, tbl, new_name, name, key}) {
    const docKey = key || 'doc';
    let { [docKey]: doc } = attrs;

    if (doc) {
        await uploadFilesUpdate({
            id,
            doc,
            new_name,
            onUpdate: async ({ id, ...attrsUpdate }) => {
                attrs[docKey] = attrsUpdate[docKey];
            }
        });
    }
}
