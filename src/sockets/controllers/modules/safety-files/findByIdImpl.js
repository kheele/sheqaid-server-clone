const {orgs_fragment} = require("../../../../graphql/Fragments");
const {safety_file_details_find_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findOneSafetyFileQuestionnaireQuery {
                default_contractor_questionnaires(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${safety_file_details_find_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findOneSafetyFileQuestionnaireQuery",
    });
}
//</editor-fold>