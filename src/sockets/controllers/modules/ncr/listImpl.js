const {orgs_fragment} = require("../../../../graphql/Fragments");
const {ncr_details_fragment, getVariablesAndQueryConfig} = require('./commons');

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
		id_list,
		//
		expiry_date = 'ALL',
		mon, mon2, mon3,
		source,
		responsible_party_list,
		assigned_job_position_list,
		assigned_person_list,
		approving_person_list,
		type,
		priority,
		allocation,
		status_progress,
		status_acceptance,
		result,
		due_date_range,
		progress_date_range,
		completed_date_range,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		id,
		//
		expiry_date,
		mon, mon2, mon3,
		source,
		responsible_party_list,
		assigned_job_position_list,
		assigned_person_list,
		approving_person_list,
		type,
		priority,
		allocation,
		status_progress,
		status_acceptance,
		result,
		due_date_range,
		progress_date_range,
		completed_date_range,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllNCRByLoggedQuery {
            sheq_non_conformances(
              where: {
                  ${filter}
              }
            ) {
                ${ncr_details_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllNCRByLoggedQuery",
		});
	} else if(id_list) {
		return listGraphQL({
			query: `
				query listByIdsNCRByLoggedQuery {
	        sheq_non_conformances(
	          where: {
	            id: {_in: [${id_list.join(',')}]}
	          },
	          order_by: {desc: asc, sort: asc}
	        ) {
	          ${ncr_details_fragment}
	          ${orgs_fragment}
	        }
	      }
			`,
			operationName: "listAllNCRByLoggedQuery",
		});
	} else {
		return listGraphQL({
			query: `
				query listAllNCRByLoggedQuery {
	        sheq_non_conformances(
	          where: {
	            removed: {_eq: ${removed}},
	            ${filter}
	          },
	          order_by: {desc: asc, sort: asc},
	          offset: ${offset}
	          ${limit > 0 ? `,limit: ${limit}` : ''}
	        ) {
	          ${ncr_details_fragment}
	          ${orgs_fragment}
	        }
	      }
			`,
			operationName: "listAllNCRByLoggedQuery",
		});
	}
}
//</editor-fold>
