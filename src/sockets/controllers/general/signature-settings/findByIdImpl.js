const {orgs_fragment} = require("../../../../graphql/Fragments");
const {inspection_details_find_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findOneInspectionQuestionnaireQuery {
                default_contractor_questionnaires(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${inspection_details_find_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findOneInspectionQuestionnaireQuery",
    });
}
//</editor-fold>