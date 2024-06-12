const {orgs_fragment} = require("../../../../graphql/Fragments");
const {incident_details_one_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdIncidentQuery {
                sheq_incident_investigation(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${incident_details_one_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdIncidentQuery",
    });
}
//</editor-fold>
