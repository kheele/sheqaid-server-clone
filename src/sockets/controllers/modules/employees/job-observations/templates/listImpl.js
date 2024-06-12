const {orgs_no_project_and_site_fragment} = require("../../../../../../graphql/Fragments");
const {job_observation_template_details_list_fragment, getVariablesAndQueryConfig} = require('./commons');

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
		//
		employee_id,
		status,
		name,
		scheduled,
		visibility,
		job_position_id,
		job_position_list,
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
		//
		id,
		//
		status,
		name,
		scheduled,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllJobObservationTemplateByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                 ${filter}
              }
            ) {
                ${job_observation_template_details_list_fragment}
                ${orgs_no_project_and_site_fragment}
            }
        }
      `,
			operationName: "listAllJobObservationTemplateByLoggedQuery",
		});
	} else {
		let _or;
		
		if (visibility) {
			_or = `
				{visibility: {_eq: "${visibility}"}},
        {${filter}}
			`;
		} else {
			_or = `
				{_or: [
          {visibility: {_eq: "Public"}},
          {_and: [
            {visibility: {_eq: "Private"}},
            {${filter}}
          ]}
        ]}
			`;
		}
		
		let where_job_position_id;
		if (job_position_list) {
			where_job_position_id = `
					{job_position_id:{_in: [${job_position_list.map(v => v.id).join(',')}]}},
				`;
		} else if (job_position_id) {
			where_job_position_id = `
					{job_position_id:{_eq: ${job_position_id}}},
				`;
		}
		
		return listGraphQL({
			query: `
        query listAllJobObservationTemplateByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                _and: [
                  {removed: {_eq: ${removed}}},
                  {group: {_eq: "Job Observations"}},
                  {is_template: {_eq: true}},
                  ${employee_id ? `{employee_id: {_eq: ${employee_id}}},` : ''}
                  ${where_job_position_id ? where_job_position_id : ''}
                  ${_or}
                ]
              },
              order_by: {name: asc},
              offset: ${offset},
              ${limit > 0 ? `limit: ${limit}` : ''}
            ) {
                ${job_observation_template_details_list_fragment}
                ${orgs_no_project_and_site_fragment}
            }
        }
      `,
			operationName: "listAllJobObservationTemplateByLoggedQuery",
		});
	}
}
//</editor-fold>
