const {coida_claims_wcl_5_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdWCL5Query {
                coida_claims_wcl_5(
                  where: {id: {_eq: ${id}},},
                ) {
                  ${coida_claims_wcl_5_fragment}
                }
            }
        `,
        operationName: "findByIdWCL5Query",
    });
}
//</editor-fold>