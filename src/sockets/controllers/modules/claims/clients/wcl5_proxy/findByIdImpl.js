const {coida_claims_proxy__wcl_5_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdWCL5ProxyQuery {
                proxy_coida_claims__wcl_5(
                  where: {id: {_eq: ${id}},},
                ) {
                  ${coida_claims_proxy__wcl_5_fragment}
                }
            }
        `,
        operationName: "findByIdWCL5ProxyQuery",
    });
}
//</editor-fold>