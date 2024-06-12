const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {incident_quick_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findOneQuickIncidentQuery {
                sheq_incident_investigation_quick(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${incident_quick_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findOneQuickIncidentQuery",
    });
}
//</editor-fold>