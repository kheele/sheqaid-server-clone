const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {coida_claims_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdClaimsClientQuery {
                coida_claims(
                  where: {id: {_eq: ${id}},},
                ) {
                  ${coida_claims_fragment}
                  ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdClaimsClientQuery",
    });
}
//</editor-fold>