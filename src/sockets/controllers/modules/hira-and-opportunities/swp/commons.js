const {
	employee_personal_details_fragment,
	personal_details_other_fragment,
} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		category,
		work_task,
		location,
		department_list,
		department_id,
		person_approving_procedure_list,
		person_approving_procedure_id,
		sign_sheet_employee_list,
		sign_sheet_employee_id,
		//
		expiry_range,
		//
		logged_employee_id,
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
		if (logged_employee_id) {
			filter.push(`_or: [
				{person_approving_procedure_id: {_eq: ${logged_employee_id}}},
				{department:{employee_list:{id: {_eq: ${logged_employee_id}}}}},
				{ppe_type_required_list:{ppe:{representative_list:{employee_id: {_eq: ${logged_employee_id}}}}}},
				{sign_sheet_employee_list:{employee_id: {_eq: ${logged_employee_id}}}},
			]`);
		}
		
		//: /etc/letsencrypt/live/cloud.sheqintel.com/fullchain.pem
		//: /etc/nginx/certs/all.cloud.sheqintel.com.crt
		
		//:copy /etc/letsencrypt/live/cloud.sheqintel.com/fullchain.pem to ./certs/all.cloud.sheqintel.com.crt
		
		//
		if (category) {
			filter.push(`category: {_like: "%${category}%"}`);
		}
		if (work_task) {
			filter.push(`work_task: {_like: "%${work_task}%"}`);
		}
		if (location) {
			filter.push(`location: {_like: "%${location}%"}`);
		}
		
		if (department_list) {
			filter.push(`department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}`);
		}
		if (department_id) {
			filter.push(`department_id: {_eq: ${department_id}}`);
		}
		if (person_approving_procedure_list) {
			filter.push(`person_approving_procedure_id: {_in: [${person_approving_procedure_list.map(v => v.id).join(', ')}]}`);
		}
		if (person_approving_procedure_id) {
			filter.push(`person_approving_procedure_id: {_eq: ${person_approving_procedure_id}}`);
		}
		if (sign_sheet_employee_list) {
			filter.push(`sign_sheet_employee_list:{employee_id: {_in: [${sign_sheet_employee_list.map(v => v.id).join(', ')}]}}`);
		}
		if (sign_sheet_employee_id) {
			filter.push(`sign_sheet_employee_list:{employee_id: {_eq: ${sign_sheet_employee_id}}}`);
		}
		
		if (expiry_range) {
			const {start, end} = expiry_range;
			if (start && end) {
				filter.push(`expiry: {_gte: "${start}", _lte: "${end}"}`);
			} else if (start) {
				filter.push(`expiry: {_gte: "${start}"}`);
			} else if (end) {
				filter.push(`expiry: {_lte: "${end}"}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="hira_swp_details_fragment">
exports.hira_swp_details_fragment = `
  id
    created_at
		removed
		date_created
		expiry
		category
		location
		work_task
		sign_sheet_notes
		notes
		doc
		steps_to_perform_task_list
		training_requirement_list
    department{
      id
      name
    }
		person_approving_procedure{
			${employee_personal_details_fragment}
		}
		potential_hazard_and_possible_cause_list{
			id
			swp_id
			cause
			hazard
			rating
		}
		ppe_type_required_list{
			id
			ppe_type{
				id
				name
				profile_pic
			}
		}
		sign_sheet_employee_list{
			id
			swp_id
			signature
			employee{
				${employee_personal_details_fragment}
			}
		}
`;
//</editor-fold>
