const {employee_basic_personal_details_fragment} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		inspection_date_range,
		ppe_condition,
		ppe_item_id,
		inspector_id,
		//
		team_id,
		team_list,
		department_id,
		department_list,
		job_position_id,
		job_position_list,
		employee_id,
		employee_list,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (inspection_date_range) {
			const {start, end} = inspection_date_range;
			if (start && end) {
				filter.push(`inspection_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
			} else if (start) {
				filter.push(`inspection_date: {_gte: "${Dates.formatDateSQL(start)}"}`);
			} else if (end) {
				filter.push(`inspection_date: {_lte: "${Dates.formatDateSQL(end)}"}`);
			}
		}
		if (ppe_condition) {
			filter.push(`ppe_condition: {_eq: "${ppe_condition}"}`);
		}
		if (ppe_item_id) {
			filter.push(`ppe_item_id: {_eq: ${ppe_item_id}}`);
		}
		if (inspector_id) {
			filter.push(`inspector_id: {_eq: ${inspector_id}}`);
		}
		//
		if (team_list) {
			filter.push(`ppe_item:{employee_list:{employee:{team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}}}}`);
		}
		if (team_id) {
			filter.push(`ppe_item:{employee_list:{employee:{team_id: {_eq: ${team_id}}}}}`);
		}
		
		if (department_list) {
			filter.push(`ppe_item:{employee_list:{employee:{department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}}}}`);
		}
		if (department_id) {
			filter.push(`ppe_item:{employee_list:{employee:{department_id: {_eq: ${department_id}}}}}`);
		}
		
		if (job_position_list) {
			filter.push(`ppe_item:{employee_list:{employee:{job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}}}}`);
		}
		if (job_position_id) {
			filter.push(`ppe_item:{employee_list:{employee:{job_position_id: {_eq: ${job_position_id}}}}}`);
		}
		
		if (employee_list) {
			filter.push(`ppe_item:{employee_list:{employee_id: {_in: [${employee_list.map(v => v.id).join(', ')}]}}}`);
		}
		if (employee_id) {
			filter.push(`ppe_item:{employee_list:{employee_id: {_eq: ${employee_id}}}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="ppe_inspection_details_fragment">
exports.ppe_inspection_details_fragment = `
  id
  inspection_date
  ppe_condition
  issues
  doc
  ppe_item{
  	id
    created_at
    removed
    serial_num
    purchase_date
    condition
    notes
    profile_pic
    employee_list{
    	id
    	employee{
    		${employee_basic_personal_details_fragment}
    	}
    }
  }
  inspector{
  	${employee_basic_personal_details_fragment}
  }
`;
//</editor-fold>
