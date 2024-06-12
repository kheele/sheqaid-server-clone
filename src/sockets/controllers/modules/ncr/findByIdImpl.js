const {orgs_fragment} = require("../../../../graphql/Fragments");
const {ncr_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdNCRQuery {
                sheq_non_conformances(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${ncr_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdNCRQuery",
    });
}
//</editor-fold>
