const findByIdImpl = require("./findByIdImpl");

//<editor-fold desc="createImpl">
module.exports = (config) => {
    return async (socket, input) => {
        if(!input) return;

        const {
            name,
            tbl,
            details_fragment,
            orgs_fragment,
            uploadUpdate,
            // onUploadExist,
            // onUploadComplete,
            skipOrgs,
        } = config;

        socket && socket.injectCreate(input, skipOrgs);
        console.log('createImpl:', input);

        const auth = socket ? await socket.getAuth() : null;

        // const uploadExist = onUploadExist && onUploadExist(input);

        const res = await insertGraphQL({
            mutation: `
                mutation insert${name}Mutation($object: ${tbl}_insert_input!) {
                    insert_${tbl}_one(
                        object: $object
                    ) {
                        id
                    }
                }
            `,
            input,
            operationName: `insert${name}Mutation`,
            auth,
        });

        if (res) {
            const findById = findByIdImpl({
                name,
                tbl,
                details_fragment,
                orgs_fragment,
            });

            let savedItem = await findById(socket, res.id);

            if (uploadUpdate && isFunction(uploadUpdate)) {
                const { new_name, new_names, key, keys } = uploadUpdate(savedItem);
                const { id } = res;
                if (keys) {
                    await Promise.all(keys.map(async (key, n) => {
                        const __new_name = new_names ? new_names[n] : new_name;
                        await upload({input, id, tbl, new_name: __new_name, name, key});
                    }));
                    savedItem = await whenFileReady(socket, res, findById, keys);
                } else {
                    const __new_name = new_names ? new_names[0] : new_name;
                    await upload({input, id, tbl, new_name: __new_name, name, key});
                    savedItem = await whenFileReady(socket, res, findById, [key]);
                }

            }

            return savedItem;
        }
    };
};
//</editor-fold>

async function upload({input, id, tbl, new_name, name, key}) {
    const docKey = key || 'doc';
    let { [docKey]: doc } = input;

    if (doc) {
        await uploadFilesUpdate({
            id,
            doc,
            new_name,
            onUpdate: async ({ id, ...attrs }) => {
                delete attrs.id;

                await updateRelay({
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
                });
            }
        });
    }
}
