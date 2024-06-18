const {orgs_fragment, user_personal_details_fragment} = require("../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		//
		id,
		excludeIds,
		//
		name,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		excludeIds,
		//
		id,
		//
		name,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllUserByLoggedQuery {
            default_users(
              where: {
                  ${filter}
              }
            ) {
                ${user_personal_details_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllUserByLoggedQuery",
		});
	} else {
		return listGraphQL({
			query: `
        query listAllUserByLoggedQuery {
            default_users(
              where: {
                  removed: {_eq: ${removed}},
                  ${filter}
              },
              order_by: {lname: asc, fname: asc},
              offset: ${offset},
              ${limit > 0 ? `limit: ${limit}` : ''}
            ) {
                ${user_personal_details_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllUserByLoggedQuery",
		});
	}
}
//</editor-fold>
