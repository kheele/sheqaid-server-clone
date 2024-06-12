let {orgs_fragment} = require("../../../graphql/Fragments");

//<editor-fold desc="listImpl">
module.exports = (
	{
		name,
		tbl,
		details_fragment,
		orgs_fragment: orgs_fragment_override,
	}
) => {
	return async (socket, id) => {
		const __orgs_fragment = orgs_fragment_override === null ? '' : orgs_fragment_override || orgs_fragment;
		console.log('findByIdImpl => orgs_fragment:', __orgs_fragment);
		return getGraphQLOne({
			query: `
	      query findById${name}Query {
	        ${tbl}(
	            where: {id: {_eq: ${id}},},
	        ) {
	            ${isFunction(details_fragment) ? details_fragment() : details_fragment}
	            ${__orgs_fragment}
	        }
	      }
	    `,
			operationName: `findById${name}Query`,
		});
	};
}
//</editor-fold>
