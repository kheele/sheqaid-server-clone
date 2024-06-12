const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {contractor_questionnaire_details_find_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findOneContractorQuestionnaireQuery {
                default_contractor_questionnaires(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${contractor_questionnaire_details_find_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findOneContractorQuestionnaireQuery",
    });
}
//</editor-fold>
