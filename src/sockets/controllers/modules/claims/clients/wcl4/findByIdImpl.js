const {coida_claims_wcl_4_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdWCL4Query {
                coida_claims_wcl_4(
                  where: {id: {_eq: ${id}},},
                ) {
                  ${coida_claims_wcl_4_fragment}
                }
            }
        `,
        operationName: "findByIdWCL4Query",
    });
}
//</editor-fold>