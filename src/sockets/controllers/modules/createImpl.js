const findByIdImpl = require("./findByIdImpl");

//<editor-fold desc="createImpl">
module.exports = (
    {
        name,
        tbl,
        details_fragment,
        orgs_fragment,
        uploadUpdate,
    }
) => {
    return async (socket, input) => {
        socket.injectCreate(input);
        console.log('createImpl:', input);

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
        });

        if (res) {
            if (isFunction(uploadUpdate)) {
                const { new_name, key, keys } = uploadUpdate(res.id);
                const { id } = res;
                if (keys) {
                    await Promise.all(keys.map(async key => {
                        return await upload({input, id, tbl, new_name, name, key});
                    }));
                } else {
                    await upload({input, id, tbl, new_name, name, key});
                }
            }

            const findById = findByIdImpl({
                name,
                tbl,
                details_fragment,
                orgs_fragment,
            });
            return findById(socket, res.id);
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
