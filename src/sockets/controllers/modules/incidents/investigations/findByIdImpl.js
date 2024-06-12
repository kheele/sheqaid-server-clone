const {incident_investigation_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdIncidentInvestigationQuery {
                sheq_incident_investigation_investigations(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${incident_investigation_details_fragment}
                }
            }
        `,
        operationName: "findByIdIncidentInvestigationQuery",
    });
}
//</editor-fold>