const {incident_investigation_cause_analysis_root_fragment} = require('../investigations/commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdIncidentCauseAnalysisRootQuery {
                sheq_incident_investigation_cause_analysis_root(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${incident_investigation_cause_analysis_root_fragment}
                }
            }
        `,
        operationName: "findByIdIncidentCauseAnalysisRootQuery",
    });
}
//</editor-fold>