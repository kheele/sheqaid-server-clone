const {orgs_fragment} = require("../../../../../graphql/Fragments");

//<editor-fold desc="findByIdImpl">
module.exports = async ({socket, id, tbl, inc_fragment, singular}) => {
    return getGraphQLOne({
        query: `
            query findByIdEmployee${singular}Query {
                ${tbl}(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${inc_fragment({inc_employee: true})}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: `findByIdEmployee${singular}Query`,
    });
}
//</editor-fold>