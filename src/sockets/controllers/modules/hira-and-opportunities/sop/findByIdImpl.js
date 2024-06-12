const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {hira_sop_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdSOPQuery {
                hira_sop(
                  where: {id: {_eq: ${id}}}
                ) {
                  ${hira_sop_details_fragment}
                  ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdSOPQuery",
    });
}
//</editor-fold>
