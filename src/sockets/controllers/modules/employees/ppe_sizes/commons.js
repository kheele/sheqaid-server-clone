
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		unit,
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
		if (name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		
		if (unit) {
			filter.push(`unit: {_ilike: "%${unit}%"}`);
		}
		
		if (team_list) {
			filter.push(`team_list: {team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}}`);
		}
		if (team_id) {
			filter.push(`team_list: {team_id: {_eq: ${team_id}}}`);
		}
		
		if (department_list) {
			filter.push(`department_list: {department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}}`);
		}
		if (department_id) {
			filter.push(`department_list: {department_id: {_eq: ${department_id}}}`);
		}
		
		if (job_position_list) {
			filter.push(`job_position_list: {job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}}`);
		}
		if (job_position_id) {
			filter.push(`job_position_list: {job_position_id: {_eq: ${job_position_id}}}`);
		}
		
		if (employee_list) {
			filter.push(`employee_list: {employee_id: {_in: [${employee_list.map(v => v.id).join(', ')}]}}`);
		}
		if (employee_id) {
			filter.push(`employee_list: {employee_id: {_eq: ${employee_id}}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="ppe_size_details_fragment">
exports.ppe_size_details_fragment = `
  id
  
`;
//</editor-fold>
