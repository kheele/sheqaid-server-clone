const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {job_observation_details_find_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findOneJobObservationQuestionnaireQuery {
                default_contractor_questionnaires(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${job_observation_details_find_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findOneJobObservationQuestionnaireQuery",
    });
}
//</editor-fold>
