const findByIdImpl = require("./findByIdImpl");

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
        console.log('updateImpl:', attrs);
        const { id } = attrs;
        delete attrs.id;

        const auth = await socket.getAuth();

        const findById = findByIdImpl({
            name,
            tbl,
            details_fragment,
            orgs_fragment,
        })

        const item = await findById(socket, id);
        if (!item) return;

        if (isFunction(uploadUpdate)) {
            const { new_name, key } = uploadUpdate(id);
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

        const res = await updateGraphQL({
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

        if (res) {
            return findById(socket, res.id);
        }
    };
};
//</editor-fold>
