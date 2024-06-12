const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {training_register_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdTrainingRegisterQuery {
                sheq_training_registers(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${training_register_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdTrainingRegisterQuery",
    });
}
//</editor-fold>