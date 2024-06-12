const {employee_personal_details_fragment} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		category,
		risk_level,
		location,
		prepared_by_list,
		prepared_by_id,
		//
		date_created_range,
		date_revised_range,
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
			filter.push(`prepared_by_id: {_eq: ${logged_employee_id}}`);
		}
		
		//
		if (category) {
			filter.push(`category: {_eq: "${category}"}`);
		}
		if (risk_level) {
			filter.push(`risk_level: {_eq: "${risk_level}"}`);
		}
		if (location) {
			filter.push(`location: {_like: "%${location}%"}`);
		}
		if (prepared_by_id) {
			filter.push(`prepared_by_id: {_eq: ${prepared_by_id}}`);
		}
		if (prepared_by_list) {
			filter.push(`prepared_by_id: {_in: [${prepared_by_list.map(v => v.id).join(', ')}]}`);
		}
		
		if (date_created_range) {
			const {start, end} = date_created_range;
			if (start && end) {
				filter.push(`date_created: {_gte: "${start}", _lte: "${end}"}`);
			} else if (start) {
				filter.push(`date_created: {_gte: "${start}"}`);
			} else if (end) {
				filter.push(`date_created: {_lte: "${end}"}`);
			}
		}
		if (date_revised_range) {
			const {start, end} = date_revised_range;
			if (start && end) {
				filter.push(`date_revised: {_gte: "${start}", _lte: "${end}"}`);
			} else if (start) {
				filter.push(`date_revised: {_gte: "${start}"}`);
			} else if (end) {
				filter.push(`date_revised: {_lte: "${end}"}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="hira_sop_details_fragment">
const hira_sop_details_fragment = `
    id
    created_at
		date_created
		date_revised
		category
		location
		risk_level
		other
		doc
		close_down_list
		custom_safety_pre_requesite_list
		key_point_list
		operation_list
		procedure_list
		risk_list
		safety_pre_requesite_list
		prepared_by{
			${employee_personal_details_fragment}
		}
`;
exports.hira_sop_details_fragment = hira_sop_details_fragment;
//</editor-fold>
