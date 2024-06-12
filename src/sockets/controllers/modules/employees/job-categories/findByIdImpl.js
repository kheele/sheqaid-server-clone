const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {job_categories_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdJobCategoryQuery {
                default_job_categories(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${job_categories_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdJobCategoryQuery",
    });
}
//</editor-fold>