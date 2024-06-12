const {orgs_fragment} = require("../../../../graphql/Fragments");
const {audit_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdAuditQuery {
                sheq_compliance_audits(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${audit_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdAuditQuery",
    });
}
//</editor-fold>
