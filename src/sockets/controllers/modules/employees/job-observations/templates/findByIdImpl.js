const {orgs_no_project_and_site_fragment} = require("../../../../../../graphql/Fragments");
const {job_observation_template_details_find_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findOneJobObservationTemplateQuery {
                default_contractor_questionnaires(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${job_observation_template_details_find_fragment}
                    ${orgs_no_project_and_site_fragment}
                }
            }
        `,
        operationName: "findOneJobObservationTemplateQuery",
    });
}
//</editor-fold>
