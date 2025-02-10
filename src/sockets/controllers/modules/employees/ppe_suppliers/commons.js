
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		contact_person,
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
		if (contact_person) {
			filter.push(`contact_person: {_ilike: "%${contact_person}%"}`);
		}

		if (ppe_item_id) {
			filter.push(`ppe_item_list:{id: {_eq: ${ppe_item_id}}}`);
		}
		if (ppe_type_id) {
			filter.push(`ppe_item_list:{ppe_type_id: {_eq: ${ppe_type_id}}}`);
		}
		
		if (team_list) {
			filter.push(`ppe_item_list:{employee_list: {employee:{team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}}}}`);
		}
		if (team_id) {
			filter.push(`ppe_item_list:{employee_list: {employee:{team_id: {_eq: ${team_id}}}}}`);
		}
		
		if (department_list) {
			filter.push(`ppe_item_list:{employee_list: {employee:{department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}}}}`);
		}
		if (department_id) {
			filter.push(`ppe_item_list:{employee_list: {employee:{department_id: {_eq: ${department_id}}}}}`);
		}
		
		if (job_position_list) {
			filter.push(`ppe_item_list:{employee_list: {employee:{job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}}}}`);
		}
		if (job_position_id) {
			filter.push(`ppe_item_list:{employee_list: {employee:{job_position_id: {_eq: ${job_position_id}}}}}`);
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

//<editor-fold desc="ppe_supplier_details_fragment">
exports.ppe_supplier_details_fragment = `
  id
  name
  contact_person
  email
  phone
  address
  
  ppe_item_list_aggregate{
    aggregate {
      count
    }
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
    ppe_type{
        id
        name
        unit
        profile_pic
        duration_type
        duration_value
    }
  }
`;
//</editor-fold>
