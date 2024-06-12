const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {ppe_one_details_fragment} = require('./commons');

//<editor-fold desc="findByIdImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdPPEQuery {
                ppe_types(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${ppe_one_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdPPEQuery",
    });
}
//</editor-fold>
