const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {teams_details_one_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdTeamQuery {
                default_teams(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${teams_details_one_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdTeamQuery",
    });
}
//</editor-fold>