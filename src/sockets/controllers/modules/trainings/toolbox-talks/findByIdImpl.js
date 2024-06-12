const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {training_toolbox_talks_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdToolboxTalksQuery {
                sheq_training_toolbox_talks(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${training_toolbox_talks_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdToolboxTalksQuery",
    });
}
//</editor-fold>