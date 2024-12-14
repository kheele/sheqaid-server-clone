const findByIdImpl = require("./findByIdImpl");

//<editor-fold desc="deleteImpl">
module.exports = (config) => {
    return async (socket, id) => {
        if (!id) return;

        const {
            name,
            tbl,
            details_fragment,
            orgs_fragment,
        } = config;

        console.log('deleteImpl:', id);

        const auth = await socket.getAuth();

        const findById = findByIdImpl({
            name,
            tbl,
            details_fragment,
            orgs_fragment,
        })

        const item = await findById(socket, id);
        if (!item) return;

        return await deleteGraphQL({
            mutation: `
                mutation delete${name}Mutation($id: bigint!) {
                    delete_${tbl}_by_pk(id: $id) {
                        id
                    }
                }
            `,
            operationName: `delete${name}Mutation`,
            id,
            auth,
        });
    };
};
//</editor-fold>
