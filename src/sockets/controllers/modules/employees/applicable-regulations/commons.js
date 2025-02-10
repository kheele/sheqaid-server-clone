
//<editor-fold desc="getVariablesAndQueryConfig">
const {buildQueryFilter} = require("../commons_funs");
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		code,
		desc,
		jurisdiction,
		effective_date_range,
		compliance_requirement_id,
		job_task_id,
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
		if (code) {
			filter.push(`code: {_ilike: "%${code}%"}`);
		}
		if (desc) {
			filter.push(`desc: {_ilike: "%${desc}%"}`);
		}
		if (jurisdiction) {
			filter.push(`jurisdiction: {_ilike: "%${jurisdiction}%"}`);
		}

		if (effective_date_range) {
			const {start, end} = effective_date_range;
			if (start && end) {
				filter.push(`effective_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
			} else if (start) {
				filter.push(`effective_date: {_gte: "${Dates.formatDateSQL(start)}"}`);
			} else if (end) {
				filter.push(`effective_date: {_lte: "${Dates.formatDateSQL(end)}"}`);
			}
		}

		const getPathByEmployee = (value, key = "") => {
			return `ppe_type:{ppe_item_list:{employee_list: {employee${key}: {${value}}}}}`;
		};

		let job_task_filter = filter_job_task_list => {
			return `job_task:{ppe_type_list:{${filter_job_task_list.join(',')}}}`;
		};

		let filter_compliance_requirement_list = [];
		let filter_job_task_list = [];

		if (compliance_requirement_id) {
			filter_compliance_requirement_list.push(`compliance_requirement_id: {_eq: ${compliance_requirement_id}}`);
		}

		if (ppe_item_id) {
			filter_job_task_list.push(`ppe_type:{ppe_item_list:{id: {_eq: ${ppe_item_id}}}}`);
		}
		if (ppe_type_id) {
			filter_job_task_list.push(`ppe_type_id: {_eq: ${ppe_type_id}}`);
		}

		buildQueryFilter({
			data: {
				job_task_id,
				//
				team_id,
				team_list,
				department_id,
				department_list,
				job_position_id,
				job_position_list,
				employee_id,
				employee_list,
			},
			filter_list: filter_job_task_list,
			filter: filter_compliance_requirement_list,
			job_task_filter,
			getPathByEmployee,
		});

		if (!job_task_id && filter_job_task_list.isNotEmpty()) {
			filter_compliance_requirement_list.push(`compliance_requirement:{job_task_list:{${job_task_filter(filter_job_task_list)}}}`);
		}

		if (filter_compliance_requirement_list.isNotEmpty()) {
			filter.push(`compliance_requirement_list:{${filter_compliance_requirement_list.join(',')}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="regulations_details_fragment">
exports.regulations_details_fragment = `
  id
  removed
  code
  desc
  jurisdiction
  effective_date
  
  compliance_requirement_list_aggregate{
    aggregate {
      count
    }
  }
  compliance_requirement_list{
  	id
    compliance_requirement{
        id
        name
        desc
        job_task_list_aggregate{
			aggregate {
			  count
			}
		}
    }
  }
`;
//</editor-fold>
