const {orgs_no_project_and_site_fragment} = require("../../../../../graphql/Fragments");
const {safety_file_template_details_find_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findOneSafetyFileTemplateQuery {
                default_contractor_questionnaires(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${safety_file_template_details_find_fragment}
                    ${orgs_no_project_and_site_fragment}
                }
            }
        `,
        operationName: "findOneSafetyFileTemplateQuery",
    });
}
//</editor-fold>