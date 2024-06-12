const {
	orgs_id_fragment,
	employee_personal_details_fragment,
	personal_details_other_fragment,
	user_personal_details_fragment,
} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		incident_date_range,
		date_reported_range,
		time_shift,
		category_list,
		person_reporting_id,
		person_reporting_other_id,
		person_injured_id,
		person_injured_other_id,
		driver_id,
		driver_other_id,
		severity,
		exact_location,
		is_vehicle_incident,
		vehicle_make,
		vehicle_reg_num,
		
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if (logged_employee_id) {
		filter.push(`_or: [
				{logged_user: {linked_employee_id:{_eq: ${logged_employee_id}}}},
				{logged_employee_id: {_eq: ${logged_employee_id}}},
				
				{person_reporting_id: {_eq: ${logged_employee_id}}},
				{person_injured_id: {_eq: ${logged_employee_id}}},
				{driver_id: {_eq: ${logged_employee_id}}},
			]`);
	}
	
	//
	if (client_id) {
		filter.push(`client_id: {_eq: ${client_id}}`);
	}
	if (project_id) {
		filter.push(`project_id: {_eq: ${project_id}}`);
	}
	if (site_id) {
		filter.push(`site_id: {_eq: ${site_id}}`);
	}
	
	if (person_reporting_id) {
		filter.push(`person_reporting_id: {_eq: ${person_reporting_id}}`);
	}
	if (person_injured_id) {
		filter.push(`person_injured_id: {_eq: ${person_injured_id}}`);
	}
	if (driver_id) {
		filter.push(`driver_id: {_eq: ${driver_id}}`);
	}
	
	if (incident_date_range) {
		const {start, end} = incident_date_range;
		if (start && end) {
			filter.push(`incident_date: {_gte: "${start}", _lte: "${end}"}`);
		} else if (start) {
			filter.push(`incident_date: {_gte: "${start}"}`);
		} else if (end) {
			filter.push(`incident_date: {_lte: "${end}"}`);
		}
	}
	if (date_reported_range) {
		const {start, end} = date_reported_range;
		if (start && end) {
			filter.push(`date_reported: {_gte: "${start}", _lte: "${end}"}`);
		} else if (start) {
			filter.push(`date_reported: {_gte: "${start}"}`);
		} else if (end) {
			filter.push(`date_reported: {_lte: "${end}"}`);
		}
	}
	
	if (category_list && category_list.isNotEmpty()) {
		filter.push(`category_list: {category_id: {_in: [${category_list.map(v => v.id)}]}}`);
	}
	if (time_shift) {
		filter.push(`time_shift: {_eq: "${time_shift}"}`);
	}
	
	if (severity) {
		filter.push(`severity: {_eq: "${severity}"}`);
	}
	if (exact_location) {
		filter.push(`exact_location: {_ilike: "%${exact_location}%"}`);
	}
	
	if (isBoolean(is_vehicle_incident)) {
		filter.push(`is_vehicle_incident: {_eq: ${is_vehicle_incident}}`);
	}
	
	if (vehicle_make) {
		filter.push(`vehicle_make: {_ilike: "%${vehicle_make}%"}`);
	}
	if (vehicle_reg_num) {
		filter.push(`vehicle_reg_num: {_ilike: "%${vehicle_reg_num}%"}`);
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="incident_quick_details_fragment">
exports.incident_quick_details_fragment = `
  id
  
  logged_user{
    ${user_personal_details_fragment}
  }
  logged_employee{
    ${employee_personal_details_fragment}
  }
  exact_location
  latitude
  longitude
  short_desc
  incident_date
  incident_time
  date_reported
  time_reported
  time_shift
  person_reporting{
    ${employee_personal_details_fragment}
  }
  person_reporting_other{
    ${personal_details_other_fragment}
  }
  person_injured{
    ${employee_personal_details_fragment}
  }
  person_injured_other{
    ${personal_details_other_fragment}
  }
  is_vehicle_incident
  driver{
    ${employee_personal_details_fragment}
  }
  driver_other{
    ${personal_details_other_fragment}
  }
  
  driver_email
  driver_phone
  vehicle_make
  vehicle_reg_num
  severity
  category_list{
    category{
      id
      name
    }
  }
  nature_of_injury_list:injury_list(where:{injury:{type:{_eq:"Nature"}}}){
    injury{
      id
      name
    }
  }
  bodily_injury_location_list:injury_list(where:{injury:{type:{_eq:"Bodily Parts"}}}){
    injury{
      id
      name
    }
  }
  injury_mechanism_list:injury_list(where:{injury:{type:{_eq:"Direct Cause"}}}){
    injury{
      id
      name
    }
  }
  image_list:doc_list(where:{type:{_eq:"Image"}}){
    id
    doc
    type
  }
  video_list:doc_list(where:{type:{_eq:"Video"}}){
    id
    doc
    type
  }
  
  contractor_site{
    id
    name
  }
  contractor_client{
    id
    name
  }
  contractor {
    id
    name
  }
`;
//</editor-fold>
