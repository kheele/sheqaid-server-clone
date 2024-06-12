const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {training_matrix_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdTrainingMatrixQuery {
                sheq_training_matrices(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${training_matrix_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdTrainingMatrixQuery",
    });
}
//</editor-fold>