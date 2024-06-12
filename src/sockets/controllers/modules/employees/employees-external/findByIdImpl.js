const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {employee_external_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdEmployeeExternalQuery {
                hr_employees_external(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${employee_external_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdEmployeeExternalQuery",
    });
}
//</editor-fold>
