const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {job_observation_details_list_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	// console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		//
		id,
		//
		employee_id,
		name,
		interval,
		template_id,
		job_position_id,
		job_position_list,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		orgs_filter = [],
	} = data;
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		id,
		//
		name,
		interval,
		template_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllJobObservationQuestionnaireByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                  ${filter}
              }
            ) {
                ${job_observation_details_list_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllJobObservationQuestionnaireByLoggedQuery",
		});
	} else {
		let where_job_position_id;
		if (job_position_list) {
			where_job_position_id = `
					job_position_id:{_in: [${job_position_list.map(v => v.id).join(',')}]},
				`;
		} else if (job_position_id) {
			where_job_position_id = `
					job_position_id:{_eq: ${job_position_id}},
				`;
		}
		
		return listGraphQL({
			query: `
        query listAllJobObservationQuestionnaireByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                  removed: {_eq: ${removed}},
                  group: {_eq: "Job Observations"},
                  is_template: {_eq: false},
                  ${employee_id ? `employee_id: {_eq: ${employee_id}},` : ''}
                  ${where_job_position_id ? where_job_position_id : ''}
                  ${filter}
              },
	            order_by: {employee: {full_name: asc}, employee_other: {full_name: asc}},
              offset: ${offset},
              ${limit > 0 ? `limit: ${limit}` : ''}
            ) {
                ${job_observation_details_list_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllJobObservationQuestionnaireByLoggedQuery",
		});
	}
}
//</editor-fold>
