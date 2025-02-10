const {employee_basic_personal_details_fragment} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		location,
		added_date_range,
		last_updated_range,
		ppe_type_id,
		ppe_item_id,
		reached_reorder_threshold,

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
		if (location) {
			filter.push(`location: {_eq: "${location}"}`);
		}
		
		if (ppe_type_id) {
			filter.push(`ppe_type_id: {_eq: ${ppe_type_id}}`);
		}
		if (ppe_item_id) {
			filter.push(`ppe_item_list:{id: {_eq: ${ppe_item_id}}}`);
		}

		if(added_date_range) {
			const {start, end} = added_date_range;
			if (start && end) {
				filter.push(`added_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
			} else if (start) {
				filter.push(`added_date: {_gte: "${Dates.formatDateSQL(start)}"}`);
			} else if (end) {
				filter.push(`added_date: {_lte: "${Dates.formatDateSQL(end)}"}`);
			}
		}
		if(last_updated_range) {
			const {start, end} = last_updated_range;
			if (start && end) {
				filter.push(`last_updated: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
			} else if (start) {
				filter.push(`last_updated: {_gte: "${Dates.formatDateSQL(start)}"}`);
			} else if (end) {
				filter.push(`last_updated: {_lte: "${Dates.formatDateSQL(end)}"}`);
			}
		}

		if(reached_reorder_threshold) {
			filter.push(`reorder_threshold: {_lte: quantity}`);
		}
		
		if (team_list) {
			filter.push(`ppe_item_list:{employee_list: {employee: {team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}}}}`);
		}
		if (team_id) {
			filter.push(`ppe_item_list:{employee_list: {employee: {team_id: {_eq: ${team_id}}}}}`);
		}
		
		if (department_list) {
			filter.push(`ppe_item_list:{employee_list: {employee: {department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}}}}`);
		}
		if (department_id) {
			filter.push(`ppe_item_list:{employee_list: {employee: {department_id: {_eq: ${department_id}}}}}`);
		}
		
		if (job_position_list) {
			filter.push(`ppe_item_list:{employee_list: {employee: {job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}}}}`);
		}
		if (job_position_id) {
			filter.push(`ppe_item_list:{employee_list: {employee: {job_position_id: {_eq: ${job_position_id}}}}}`);
		}
		
		if (employee_list) {
			filter.push(`ppe_item_list:{employee_list: {employee_id: {_in: [${employee_list.map(v => v.id).join(', ')}]}}}`);
		}
		if (employee_id) {
			filter.push(`ppe_item_list:{employee_list: {employee_id: {_eq: ${employee_id}}}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="ppe_inventory_details_fragment">
exports.ppe_inventory_details_fragment = `
  id
  quantity
  reorder_threshold
  location
  added_date
  last_updated
  ppe_type{
  	id
    name
    unit
    profile_pic
    duration_type
  	duration_value
  }
  ppe_item_list{
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
  ppe_item_list_aggregate{
    aggregate {
      count
    }
  }
`;
//</editor-fold>
