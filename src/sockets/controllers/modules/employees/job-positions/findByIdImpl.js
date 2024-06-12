const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {job_positions_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdJobPositionQuery {
                default_job_positions(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${job_positions_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdJobPositionQuery",
    });
}
//</editor-fold>