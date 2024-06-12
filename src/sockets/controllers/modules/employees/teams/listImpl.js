const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {teams_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	// console.log('data', data)
	
	data.status = data.status || (data.removed ? 'Inactive' : 'Active');
	
	let {
		offset = 0,
		limit = 50,
		//
		status = "Active",
		id,
		//
		name,
		supervisor_id,
		employee_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		id,
		//
		name,
		supervisor_id,
		employee_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs,
	});
	
	return listGraphQL({
		query: `
			query listAllTeamByLoggedClientQuery {
				default_teams(
				  where: {
						status: {_eq: "${status}"},
						${filter}
				  },
	        order_by: {name: asc},
				  offset: ${offset},
				  ${limit > 0 ? `limit: ${limit}` : ''}
				) {
				  ${teams_details_fragment}
          ${orgs_fragment}
				}
		  }
		`,
		operationName: "listAllTeamByLoggedClientQuery",
	});
}
//</editor-fold>
