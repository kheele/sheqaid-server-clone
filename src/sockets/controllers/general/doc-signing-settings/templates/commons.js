//<editor-fold desc="getVariablesAndQueryConfig">
const {employee_basic_personal_details_fragment} = require("../../../../../graphql/Fragments");
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		external_id,
		slug,
		//
		employee_id,
		// job_position_id,
		//
		name,
		doc_type,
		module_key,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (external_id) {
			filter.push(`external_id: {_eq: ${external_id}}`);
		}
		if (slug) {
			filter.push(`slug: {_eq: "${slug}"}`);
		}
		//
		if (employee_id) {
			filter.push(`employee_submitter_list:{employee_id: {_eq: ${employee_id}}}`);
		}
		// if (job_position_id) {
		// 	filter.push(`job_position_id: {_eq: ${job_position_id}}`);
		// }
		//
		if (name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if (doc_type) {
			filter.push(`doc_type: {_eq: "${doc_type}"}`);
		}
		if (module_key) {
			filter.push(`module: {key: {_eq: "${module_key}"}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="signable_doc_template_details_fragment">
const signable_doc_template_details_fragment = `
    id
      external_id
      name
      doc_type
      slug
      preview_image_url
      doc
      is_employee_owning
      module{
            id
            key
            title
            desc
            status
            sort
            manager_plugin_id
      }
      plugin{
        id
      }
      employee_submission_list{
      	id
      	external_id
      }
      employee_submitter_list{
      	id
		external_id
		opened_at
		sent_at
		completed_at
		status
		uuid
		slug
		is_owning
      	doc_template_id
      	doc_template{
      		id
      	}
		employee_id
		employee{
			${employee_basic_personal_details_fragment}
		}
		submission_id
      }
      signing_employee_list{
        id
        is_owning
        employee{
            ${employee_basic_personal_details_fragment}
        }
      }
      signing_job_position_list{
        id
        job_position{
            id
            name
        }
      }
`;
exports.signable_doc_template_details_fragment = signable_doc_template_details_fragment;
//</editor-fold>
