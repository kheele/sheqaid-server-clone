const {incident_investigation_cause_analysis_fragment} = require('../investigations/commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdIncidentCauseAnalysisQuery {
                sheq_incident_investigation_cause_analysis(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${incident_investigation_cause_analysis_fragment}
                }
            }
        `,
        operationName: "findByIdIncidentCauseAnalysisQuery",
    });
}
//</editor-fold>