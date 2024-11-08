const findByIdImpl = require("./findByIdImpl");
const updateImpl = require("./updateImpl");
const createImpl = require("./createImpl");

//<editor-fold desc="updateImpl">
module.exports = (
    {
        name,
        tbl,
        details_fragment,
        orgs_fragment,
        uploadUpdate,
    }
) => {
    return async (socket, attrs) => {
        console.log('upsertImpl:', attrs);
        const { id } = attrs;

        const auth = socket ? await socket.getAuth() : null;

        if(id) {
            const findById = findByIdImpl({
                name,
                tbl,
                details_fragment,
                orgs_fragment,
            })

            const item = await findById(socket, id);
            if (!item) return;

            const update = updateImpl({
                name,
                tbl,
                details_fragment,
                orgs_fragment,
                uploadUpdate,
            });
            return update(socket, attrs);
        }

        const create = createImpl({
            name,
            tbl,
            details_fragment,
            orgs_fragment,
            uploadUpdate,
        });

        delete attrs.id;
        return create(socket, attrs);

        // if (uploadUpdate && isFunction(uploadUpdate)) {
        //     const { new_name, key } = uploadUpdate(item);
        //     const docKey = key || 'doc';
        //     let { [docKey]: doc } = attrs;
        //
        //     if (doc) {
        //         await uploadFilesUpdate({
        //             id,
        //             doc,
        //             new_name,
        //             onUpdate: async ({ id, ...attrsUpdate }) => {
        //                 attrs[docKey] = attrsUpdate[docKey];
        //             }
        //         });
        //     }
        // }
        //
        // const res = await updateGraphQL({
        //     mutation: `
        //         mutation update${name}Mutation($id: ${tbl}_pk_columns_input!, $_set: ${tbl}_set_input!) {
        //             update_${tbl}_by_pk(pk_columns: $id, _set: $_set) {
        //                 id
        //             }
        //         }
        //     `,
        //     operationName: `update${name}Mutation`,
        //     id,
        //     attrs,
        //     auth,
        // });
        //
        // if (res) {
        //     return findById(socket, res.id);
        // }
    };
};
//</editor-fold>
