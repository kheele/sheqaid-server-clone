const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {contractor_questionnaire_template_details_find_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findOneContractorQuestionnaireTemplateQuery {
                default_contractor_questionnaire_templates(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${contractor_questionnaire_template_details_find_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findOneContractorQuestionnaireTemplateQuery",
    });
}
//</editor-fold>
