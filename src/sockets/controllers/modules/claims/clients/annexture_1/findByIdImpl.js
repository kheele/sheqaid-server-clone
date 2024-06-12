const {coida_claims_annexture_1_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdAnnexture1Query {
                coida_claims_annexture_1(
                  where: {id: {_eq: ${id}},},
                ) {
                  ${coida_claims_annexture_1_fragment}
                }
            }
        `,
        operationName: "findByIdAnnexture1Query",
    });
}
//</editor-fold>