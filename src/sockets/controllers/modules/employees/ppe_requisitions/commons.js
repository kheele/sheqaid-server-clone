const {employee_basic_personal_details_fragment} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		created_at_range,
		auto_reorder_trigger,
		approval_status,
		quantity,
		ppe_type_id,

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
		if (created_at_range) {
			const {start, end} = created_at_range;
			if (start && end) {
				filter.push(`created_at: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
			} else if (start) {
				filter.push(`created_at: {_gte: "${Dates.formatDateSQL(start)}"}`);
			} else if (end) {
				filter.push(`created_at: {_lte: "${Dates.formatDateSQL(end)}"}`);
			}
		}
		if (isBoolean(auto_reorder_trigger)) {
			filter.push(`auto_reorder_trigger: {_eq: ${auto_reorder_trigger}}`);
		}
		if (approval_status) {
			filter.push(`approval_status: {_eq: "${approval_status}"}`);
		}
		// if (quantity) {
		// 	filter.push(`quantity: {_eq: ${quantity}}`);
		// }
		if (ppe_type_id) {
			filter.push(`ppe_type_id: {_eq: ${ppe_type_id}}`);
		}
		
		if (team_list) {
			filter.push(`employee: {team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}}`);
		}
		if (team_id) {
			filter.push(`employee: {team_id: {_eq: ${team_id}}}`);
		}
		
		if (department_list) {
			filter.push(`employee: {department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}}`);
		}
		if (department_id) {
			filter.push(`employee: {department_id: {_eq: ${department_id}}}`);
		}
		
		if (job_position_list) {
			filter.push(`employee: {job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}}`);
		}
		if (job_position_id) {
			filter.push(`employee: {job_position_id: {_eq: ${job_position_id}}}`);
		}
		
		if (employee_list) {
			filter.push(`employee_id: {_in: [${employee_list.map(v => v.id).join(', ')}]}`);
		}
		if (employee_id) {
			filter.push(`employee_id: {_eq: ${employee_id}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="ppe_requisition_details_fragment">
exports.ppe_requisition_details_fragment = `
  id
  created_at
  auto_reorder_trigger
  approval_status
  quantity
  reason
  
  ppe_type{
  	id
    name
    unit
    profile_pic
    duration_type
  	duration_value
  }
  employee{
  	${employee_basic_personal_details_fragment}
  }
`;
//</editor-fold>
