const {incident_corrective_actions_factors_fragment} = require('../investigations/commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdIncidentCauseAnalysisCauseQuery {
                sheq_incident_investigation_cause_analysis_causes(
                  where: {id: {_eq: ${id}},},
                ) {
                      id
                      text
                      type
                      corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
                        ${incident_corrective_actions_factors_fragment}
                      }
                      corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
                        ${incident_corrective_actions_factors_fragment}
                      }
                      corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
                        ${incident_corrective_actions_factors_fragment}
                      }
                      corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
                        ${incident_corrective_actions_factors_fragment}
                      }
                }
            }
        `,
        operationName: "findByIdIncidentCauseAnalysisCauseQuery",
    });
}
//</editor-fold>