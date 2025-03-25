let {orgs_fragment} = require("../../../graphql/Fragments");
const getDetailsFragment = require("./getDetailsFragment");

//<editor-fold desc="findByIdImpl">
module.exports = (config) => {
	return async (socket, id) => {
		if (!id) return;

		let {
			name,
			tbl,
			details_fragment,
			orgs_fragment: orgs_fragment_override,
		} = config;

		const __orgs_fragment = orgs_fragment_override === null ? '' : orgs_fragment_override || orgs_fragment;
		// console.log('findByIdImpl => orgs_fragment:', __orgs_fragment);

		details_fragment = await getDetailsFragment({socket, data: {id}, details_fragment});

		return getGraphQLOne({
			query: `
	      query findById${name}Query {
	        ${tbl}(
	            where: {id: {_eq: ${id}},},
	        ) {
	            ${details_fragment}
	            ${__orgs_fragment}
	        }
	      }
	    `,
			operationName: `findById${name}Query`,
		});
	};
}
//</editor-fold>
