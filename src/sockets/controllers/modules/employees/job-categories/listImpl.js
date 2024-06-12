const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {job_categories_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    // console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        id,
        //
        name,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = true,
        exact_orgs_company = true,
        //
        client_filter,
        orgs_filter = [],
    } = data;

    const {filter} = getVariablesAndQueryConfig({
        orgs_filter,
        id,
        //
        name,
        //
        site_id, project_id, client_id,
        //
        exact_orgs,
        exact_orgs_company,
    });

    return listGraphQL({
        query: `
			  query listAllJobCategoryByLoggedClientQuery {
				default_job_categories(
				  where: {
					removed: {_eq: ${removed}},
					${filter}
				  },
	              order_by: {name: asc},
				  offset: ${offset},
				  ${limit > 0 ? `limit: ${limit}` : ''}
				) {
				    ${job_categories_details_fragment}
                    ${orgs_fragment}
				}
			  }
			`,
        operationName: "listAllJobCategoryByLoggedClientQuery",
    });
}
//</editor-fold>