const {coida_claims_wcl_2_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdWCL2Query {
                coida_claims_wcl_2(
                  where: {id: {_eq: ${id}},},
                ) {
                  ${coida_claims_wcl_2_fragment}
                }
            }
        `,
        operationName: "findByIdWCL2Query",
    });
}
//</editor-fold>