const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {hira_swp_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
	return getGraphQLOne({
		query: `
            query findByIdSWPQuery {
                hira_swp(
                  where: {id: {_eq: ${id}}}
                ) {
                    ${hira_swp_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
		operationName: "findByIdSWPQuery",
	});
}
//</editor-fold>
