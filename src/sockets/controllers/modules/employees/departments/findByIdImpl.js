const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {departments_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdDepartmentQuery {
                default_departments(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${departments_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdDepartmentQuery",
    });
}
//</editor-fold>