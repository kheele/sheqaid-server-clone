const {incident_investigation_cause_analysis_immediate_fragment} = require('../investigations/commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdIncidentCauseAnalysisImmediateQuery {
                sheq_incident_investigation_cause_analysis_immediate(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${incident_investigation_cause_analysis_immediate_fragment}
                }
            }
        `,
        operationName: "findByIdIncidentCauseAnalysisImmediateQuery",
    });
}
//</editor-fold>