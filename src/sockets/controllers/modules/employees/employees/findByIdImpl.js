const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {employee_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdEmployeeQuery {
                hr_employees(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${employee_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdEmployeeQuery",
    });
}
//</editor-fold>