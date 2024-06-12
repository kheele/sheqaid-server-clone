//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		incContractors = false,
		view,
		ppe_type_list,
		employee_list,
		team_list,
		department_list,
		job_position_list,
		name,
		id_or_pass_num,
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
		
		if(view === "Employee") {
			//
			if (ppe_type_list && ppe_type_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type_id: {_in: [${ppe_type_list.map(v => v.id).join(', ')}]}}`);
			}
			if (employee_list && employee_list.isNotEmpty()) {
				filter.push(`id: {_in: [${employee_list.map(v => v.id).join(', ')}]}`);
			}
			if (department_list && department_list.isNotEmpty()) {
				filter.push(`department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}`);
			}
			if (job_position_list && job_position_list.isNotEmpty()) {
				filter.push(`job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}`);
			}
			if (team_list && team_list.isNotEmpty()) {
				filter.push(`team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}`);
			}
			
			if (name || id_or_pass_num) {
				if (filter.anyMatch(v => v.trim().startsWith('_or'))) {
					if (name && id_or_pass_num) {
						filter.push(`_and: {
						_or: [
							{fname: {_ilike: "%${name}%"}}, {lname: {_ilike: "%${name}%"}},
							{id_num: {_eq: "${id_or_pass_num}"}}, {passport_num: {_ilike: "${id_or_pass_num}"}}
						]
					}`);
					} else if (name) {
						filter.push(`_and: {
					_or: [
						{fname: {_ilike: "%${name}%"}}, {lname: {_ilike: "%${name}%"}}
					]
				}`);
					} else if (id_or_pass_num) {
						filter.push(`_and: {
					_or: [
						{id_num: {_eq: "${id_or_pass_num}"}}, {passport_num: {_ilike: "${id_or_pass_num}"}}
					]
				}`);
					}
				} else {
					if (name && id_or_pass_num) {
						filter.push(`_or: [
					{fname: {_ilike: "%${name}%"}}, {lname: {_ilike: "%${name}%"}},
					{id_num: {_eq: "${id_or_pass_num}"}}, {passport_num: {_ilike: "${id_or_pass_num}"}}
				]`);
					} else if (name) {
						filter.push(`_or: [
					{fname: {_ilike: "%${name}%"}}, {lname: {_ilike: "%${name}%"}}
				]`);
					} else if (id_or_pass_num) {
						filter.push(`_or: [
					{id_num: {_eq: "${id_or_pass_num}"}}, {passport_num: {_ilike: "${id_or_pass_num}"}}
				]`);
					}
				}
			}
		} else if(view === "Team") {
			if (ppe_type_list && ppe_type_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type_id: {_in: [${ppe_type_list.map(v => v.id).join(', ')}]}}`);
			}
			if (employee_list && employee_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type:{employee_list:{employee_id: {_in: [${employee_list.map(v => v.id).join(', ')}]}}}}`);
			}
			if (department_list && department_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type:{department_list:{department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}}}}`);
			}
			if (job_position_list && job_position_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type:{job_position_list:{job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}}}}`);
			}
			if (team_list && team_list.isNotEmpty()) {
				filter.push(`id: {_in: [${team_list.map(v => v.id).join(', ')}]}`);
			}
		} else if(view === "Department") {
			if (ppe_type_list && ppe_type_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type_id: {_in: [${ppe_type_list.map(v => v.id).join(', ')}]}}`);
			}
			if (employee_list && employee_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type:{employee_list:{employee_id: {_in: [${employee_list.map(v => v.id).join(', ')}]}}}}`);
			}
			if (department_list && department_list.isNotEmpty()) {
				filter.push(`id: {_in: [${department_list.map(v => v.id).join(', ')}]}`);
			}
			if (job_position_list && job_position_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type:{job_position_list:{job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}}}}`);
			}
			if (team_list && team_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type:{team_list:{team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}}}}`);
			}
		} else if(view === "Job Position") {
			if (ppe_type_list && ppe_type_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type_id: {_in: [${ppe_type_list.map(v => v.id).join(', ')}]}}`);
			}
			if (employee_list && employee_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type:{employee_list:{employee_id: {_in: [${employee_list.map(v => v.id).join(', ')}]}}}}`);
			}
			if (department_list && department_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type:{department_list:{department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}}}}`);
			}
			if (job_position_list && job_position_list.isNotEmpty()) {
				filter.push(`id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}`);
			}
			if (team_list && team_list.isNotEmpty()) {
				filter.push(`ppe_type_list:{ppe_type:{team_list:{team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}}}}`);
			}
		} else if(view === "PPE Type") {
			if (ppe_type_list && ppe_type_list.isNotEmpty()) {
				filter.push(`id: {_in: [${ppe_type_list.map(v => v.id).join(', ')}]}`);
			}
			if (employee_list && employee_list.isNotEmpty()) {
				filter.push(`employee_list:{employee_id: {_in: [${employee_list.map(v => v.id).join(', ')}]}}`);
			}
			if (department_list && department_list.isNotEmpty()) {
				filter.push(`department_list:{department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}}`);
			}
			if (job_position_list && job_position_list.isNotEmpty()) {
				filter.push(`job_position_list:{job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}}`);
			}
			if (team_list && team_list.isNotEmpty()) {
				filter.push(`team_list:{team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>
