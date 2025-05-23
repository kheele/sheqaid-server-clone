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
            // uploadUpdateLists,
            // onUploadExist,
            // onUploadComplete,
            skipOrgs,
            skipUsers,
        } = config;

        socket && socket.injectCreate({input, skipOrgs, skipUsers});
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
            // const new_details_fragment = [];
            // if (uploadUpdateLists && isFunction(uploadUpdateLists)) {
            //     const uploadLists = uploadUpdateLists(res);
            //     const {id} = res;
            //     if (uploadLists) {
            //         uploadLists.filter(v => {
            //             const {listName} = v;
            //             const {[listName]: listRaw} = input;
            //             return !!listRaw;
            //         }).forEach((item, n) => {
            //             const {listName, key} = item;
            //             new_details_fragment.push(`
            //                 ${listName}: {
            //                     id
            //                     ${key}
            //                 }
            //             `);
            //         });
            //     }
            // }

            const findById = findByIdImpl({
                name,
                tbl,
                details_fragment,//: `${details_fragment}\n${new_details_fragment.join('\n')}`,
                orgs_fragment,
            });

            let savedItem = await findById(socket, res.id);

            if (uploadUpdate && isFunction(uploadUpdate)) {
                const { new_name, new_names, key, keys } = uploadUpdate(savedItem);
                const { id } = res;
                if (keys) {
                    await Promise.all(keys.map(async (key, n) => {
                        const __new_name = new_names ? new_names[n] : new_name;
                        return await upload({input, id, tbl, new_name: __new_name, name, key});
                    }));
                    // savedItem = await whenFileReady(socket, res, findById, keys);
                } else {
                    const __new_name = new_names ? new_names[0] : new_name;
                    await upload({input, id, tbl, new_name: __new_name, name, key});
                    // savedItem = await whenFileReady(socket, res, findById, [key]);
                }

                savedItem = await findById(socket, res.id);
            }

            // if (uploadUpdateLists && isFunction(uploadUpdateLists)) {
            //     const uploadLists = uploadUpdateLists(savedItem);
            //     const { id } = res;
            //     if (uploadLists) {
            //         await Promise.all(uploadLists.filter(v => {
            //             const {listName} = v;
            //             const {[listName]: listRaw} = input;
            //             return !!listRaw;
            //         }).map(async (item, n) => {
            //             const {tbl, listName, key, new_name, } = item;
            //             const {[listName]: listRaw} = input;
            //             const {[listName]: listSaved} = savedItem.data;
            //
            //             await Promise.all(listSaved.map(async (item, n) => {
            //                 const {tbl, listName, key, new_name} = item;
            //                 const {[listName]: list} = input;
            //                 return await upload({input, id, tbl, new_name, name, key});
            //             }));
            //             // return await upload({input, id, tbl, new_name, name, key});
            //         }));
            //         // savedItem = await whenFileReady(socket, res, findById, keys);
            //     }
            //
            //     savedItem = await findById(socket, res.id);
            // }

            return savedItem;
        }
    };
};
//</editor-fold>

async function upload({input, id, tbl, new_name, name, key}) {
    const docKey = key || 'doc';
    let { [docKey]: doc } = input;

    if (doc) {
        return await uploadFilesUpdate({
            id,
            key,
            doc,
            new_name,
            onUpdate: async ({ id, ...attrs }) => {
                delete attrs.id;

                return await updateRelay({
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
