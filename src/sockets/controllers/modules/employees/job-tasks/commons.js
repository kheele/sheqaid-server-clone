
//<editor-fold desc="getVariablesAndQueryConfig">
const {employee_basic_personal_details_fragment} = require("../../../../../graphql/Fragments");
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		priority_level,
		estimated_duration,

		category_id,
		compliance_requirement_id,
		ppe_item_id,
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
		if (name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if (priority_level) {
			filter.push(`priority_level: {_eq: "${priority_level}"}`);
		}
		if (estimated_duration) {
			filter.push(`estimated_duration: {_eq: "${estimated_duration}"}`);
		}

		if (category_id) {
			filter.push(`category_list:{category_id: {_eq: ${category_id}}}`);
		}
		if (compliance_requirement_id) {
			filter.push(`compliance_requirement_list:{compliance_requirement_id: {_eq: ${compliance_requirement_id}}}`);
		}

		const getPath = (value) => {
			return `ppe_type_list:{${value}}`;
		};

		const getPathByEmployee = (value, key = "") => {
			return `employee_list: {employee${key}: {${value}}}`;
		};

		const getPathByEmployeeId = (value) => {
			return getPathByEmployee(value, "_id");
		};

		if (ppe_item_id) {
			filter.push(getPath(`ppe_type:{ppe_item_list:{id: {_eq: ${ppe_item_id}}}}`));
		}
		if (ppe_type_id) {
			filter.push(getPath(`ppe_type_id: {_eq: ${ppe_type_id}}`));
		}
		
		if (team_list) {
			filter.push(getPathByEmployee(`team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}`));
		}
		if (team_id) {
			filter.push(getPathByEmployee(`team_id: {_eq: ${team_id}}`));
		}
		
		if (department_list) {
			filter.push(getPathByEmployee(`department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}`));
		}
		if (department_id) {
			filter.push(getPathByEmployee(`department_id: {_eq: ${department_id}}`));
		}
		
		if (job_position_list) {
			filter.push(getPathByEmployee(`job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}`));
		}
		if (job_position_id) {
			filter.push(getPathByEmployee(`job_position_id: {_eq: ${job_position_id}}`));
		}
		
		if (employee_list) {
			filter.push(getPathByEmployeeId(`_in: [${employee_list.map(v => v.id).join(', ')}]`));
		}
		if (employee_id) {
			filter.push(getPathByEmployeeId(`_eq: ${employee_id}`));
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="job_tasks_details_fragment">
exports.job_tasks_details_fragment = `
  id
  removed
  name
  desc
  priority_level
  estimated_duration
  
  category_list_aggregate{
    aggregate {
      count
    }
  }
  compliance_requirement_list_aggregate{
    aggregate {
      count
    }
  }
  employee_list_aggregate{
    aggregate {
      count
    }
  }
  job_position_list_aggregate{
    aggregate {
      count
    }
  }
  ppe_type_list_aggregate{
    aggregate {
      count
    }
  }
  
  category_list{
  	id
    category{
        id
        name
        desc
    }
  }
  compliance_requirement_list{
  	id
    compliance_requirement{
        id
        name
        desc
    }
  }
  employee_list{
  	id
    employee{
        ${employee_basic_personal_details_fragment}
    }
  }
  job_position_list{
  	id
    job_position{
        id
        name
    }
  }
  ppe_type_list{
  	id
    ppe_type{
        id
        name
    }
  }
`;
//</editor-fold>
