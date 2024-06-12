const {ppe_one_details_fragment} = require('./commons');

//<editor-fold desc="findByIdImpl">
module.exports = async (socket, id) => {
	return getGraphQLOne({
		query: `
      query findByIdPPEItemQuery {
         ppe_items(
           where: {id: {_eq: ${id}},},
         ) {
           ${ppe_one_details_fragment}
        }
      }
    `,
		operationName: "findByIdPPEItemQuery",
	});
}
//</editor-fold>
