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

//<editor-fold desc="signable_doc_submitter_details_fragment">
const signable_doc_submitter_details_fragment = `
    id
	is_owning
	external_id
	opened_at
	sent_at
	completed_at
	status
	uuid
	slug
	
    doc_template_id
    doc_template{
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
    }
	employee_id
	employee{
		${employee_basic_personal_details_fragment}
	}
	submission_id
	submission{
		id
		status
		slug
		created_at
		updated_at
		docuseal_id
		external_id
		template_id
		doc_template{
			id
			name
		}
	}
`;
exports.signable_doc_submitter_details_fragment = signable_doc_submitter_details_fragment;
//</editor-fold>
