const {incident_corrective_actions_factors_fragment} = require('../investigations/commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdIncidentCorrectiveActionQuery {
                sheq_incident_investigation_corrective_actions_factors(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${incident_corrective_actions_factors_fragment}
                }
            }
        `,
        operationName: "findByIdIncidentCorrectiveActionQuery",
    });
}
//</editor-fold>