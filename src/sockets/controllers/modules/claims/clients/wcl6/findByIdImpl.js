const {coida_claims_wcl_6_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdWCL6Query {
                coida_claims_wcl_6(
                  where: {id: {_eq: ${id}},},
                ) {
                  ${coida_claims_wcl_6_fragment}
                }
            }
        `,
        operationName: "findByIdWCL6Query",
    });
}
//</editor-fold>