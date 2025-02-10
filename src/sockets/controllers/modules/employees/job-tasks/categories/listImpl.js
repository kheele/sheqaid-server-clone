const {orgs_fragment} = require("../../../../../../graphql/Fragments");
const {ppe_details_fragment, getVariablesAndQueryConfig} = require('./commons');

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
		unit,
		team_id,
		department_id,
		job_position_id,
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
		unit,
		team_id,
		department_id,
		job_position_id,
		employee_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs,
	});
	
	return listGraphQL({
		query: `
			  query listAllPPEByLoggedQuery {
				ppe_types(
				  where: {
					removed: {_eq: ${removed}},
					${filter}
				  },
	        order_by: {name: asc},
				  offset: ${offset},
				  ${limit > 0 ? `limit: ${limit}` : ''}
				) {
				    ${ppe_details_fragment}
            ${orgs_fragment}
				}
			  }
			`,
		operationName: "listAllPPEByLoggedQuery",
	});
}
//</editor-fold>
