const {
	employee_personal_details_fragment,
	personal_details_other_fragment,
} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		person_reporting_id,
		person_reported_to_id,
		person_involved_id,
		person_injured_id,
		witness_id,
		person_distributed_to_id,
		driver_id,
		//
		category_list,
		sub_category_list,
		activity_list,
		//
		exact_location,
		is_person_injured,
		is_vehicle_incident,
		vehicle_make,
		vehicle_reg_num,
		incident_status,
		investigation_status,
		//
		group,
		consequence,
		likelihood,
		risk_rating,
		//
		day_group,
		time_shift,
		incident_date_range,
		date_reported_range,
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
			filter.push(`_or: [
				{person_reporting_id: {_eq: ${logged_employee_id}}},
				{person_reported_to_id: {_eq: ${logged_employee_id}}},
				{person_involved_list: {person_involved_id: {_eq: ${logged_employee_id}}}},
				{person_injured_id: {_eq: ${logged_employee_id}}},
				{distribution_list: {employee_id: {_eq: ${logged_employee_id}}}},
				{witness_list: {witness_id: {_eq: ${logged_employee_id}}}},
				{vehicle_list: {driver_id: {_eq: ${logged_employee_id}}}},
				
				#For Investigation
				{investigation:{investigation_team_list:{investigator_id: {_eq: ${logged_employee_id}}}}},
				
				#For Corrective Actions
				{investigation:{cause_analysis:{immediate_analysis:{cause_analysis_cause_list:{corrective_action_list:{responsible_person_id: {_eq: ${logged_employee_id}}}}}}}},
				{investigation:{cause_analysis:{root_analysis:{cause_analysis_cause_list:{corrective_action_list:{responsible_person_id: {_eq: ${logged_employee_id}}}}}}}},
				
				#For NCR
				{ncr_list:{approving_person_id: {_eq: ${logged_employee_id}}}}
				{ncr_list:{assigned_person_list: {employee_id: {_eq: ${logged_employee_id}}}}}
				#One of the following 2 below may cause error
				{ncr_list:{assigned_job_position_list: {employee_list:{id: {_eq: ${logged_employee_id}}}}}}
				#{ncr_list:{responsible_person_id: {_eq: ${logged_employee_id}}}}
			]`);
		}
		
		//
		if (person_reporting_id) {
			filter.push(`person_reporting_id: {_eq: ${person_reporting_id}}`);
		}
		if (person_reported_to_id) {
			filter.push(`person_reported_to_id: {_eq: ${person_reported_to_id}}`);
		}
		if (person_involved_id) {
			filter.push(`person_involved_list:{person_involved_id: {_eq: ${person_involved_id}}}`);
		}
		if (person_injured_id) {
			filter.push(`person_injured_id: {_eq: ${person_injured_id}}`);
		}
		if (person_distributed_to_id) {
			filter.push(`distribution_list:{employee_id: {_eq: ${person_distributed_to_id}}}`);
		}
		if (witness_id) {
			filter.push(`witness_list:{witness_id: {_eq: ${witness_id}}}`);
		}
		if (driver_id) {
			filter.push(`vehicle_list:{driver_id: {_eq: ${driver_id}}}`);
		}
		
		//
		if (category_list && category_list.isNotEmpty()) {
			filter.push(`category_list: {category_id: {_in: [${category_list.map(v => v.id)}]}}`);
		}
		if (sub_category_list && sub_category_list.isNotEmpty()) {
			filter.push(`sub_category_list: {sub_category_id: {_in: [${sub_category_list.map(v => v.id)}]}}`);
		}
		if (activity_list && activity_list.isNotEmpty()) {
			filter.push(`activity_list: {activity_id: {_in: [${activity_list.map(v => v.id)}]}}`);
		}
		
		//
		if (exact_location) {
			filter.push(`exact_location: {_ilike: "%${exact_location}%"}`);
		}
		if (isBoolean(is_vehicle_incident)) {
			filter.push(`is_vehicle_incident: {_eq: ${is_vehicle_incident}}`);
		}
		if (vehicle_make) {
			filter.push(`vehicle_list:{vehicle_make: {_ilike: "%${vehicle_make}%"}}`);
		}
		if (vehicle_reg_num) {
			filter.push(`vehicle_list:{vehicle_reg_num: {_ilike: "%${vehicle_reg_num}%"}}`);
		}
		
		if (incident_status) {
			if (incident_status === 'ClosedIncident') {
				filter.push(`status_closed: {_eq: true}`);
			} else if (incident_status === 'AwaitingApproval') {
				filter.push(`status_awaiting_approval: {_eq: true}`);
			} else if (incident_status === 'ApprovedIncident') {
				filter.push(`status_approved: {_eq: true}`);
			} else if (incident_status === 'AssignedInvestigator') {
				filter.push(`status_investigating: {_eq: true}`);
			} else if (incident_status === 'Investigating') {
				filter.push(`status_investigating: {_eq: true}`);
			}
		}
		if (investigation_status) {
			if (investigation_status === 'ClosedInvestigation') {
				filter.push(`status_closed_investigation: {_eq: true}`);
			} else if (investigation_status === 'AwaitingInvestigationApproval') {
				filter.push(`status_awaiting_investigation_approval: {_eq: true}`);
			} else if (investigation_status === 'ApprovedInvestigation') {
				filter.push(`status_approved_investigation: {_eq: true}`);
			}
		}
		
		//
		if (group) {
			filter.push(`group: {_eq: "${group}"}`);
		}
		if (consequence) {
			filter.push(`severity: {consequence: {_eq: ${consequence}}}`);
		}
		if (likelihood) {
			filter.push(`severity: {likelihood: {_eq: ${likelihood}}}`);
		}
		if (risk_rating) {
			filter.push(`severity: {risk_rating: {_eq: "${risk_rating}"}}`);
		}
		
		//
		if (day_group) {
			if (day_group === 'Morning') {
				filter.push(`incident_time: {_gte: "00:00",_lt: "12:00"}`);
			} else if (day_group === 'Afternoon') {
				filter.push(`incident_time: {_gte: "12:00", _lt: "23:59"}`);
			}
		}
		if (time_shift) {
			filter.push(`time_shift: {_eq: "${time_shift}"}`);
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
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="incident_corrective_actions_factors_fragment">
const incident_corrective_actions_factors_fragment = `
      id
      text
      cost
      date_completed
      type
      responsible_person{
        id
        full_name
        email
        job_position{
          id
          name
        }
      }
`;
exports.incident_corrective_actions_factors_fragment = incident_corrective_actions_factors_fragment;
//</editor-fold>

//<editor-fold desc="incident_investigation_cause_analysis_immediate_fragment">
const incident_investigation_cause_analysis_immediate_fragment = `
  id
      sub_standard_practices_or_unsafe_acts:cause_analysis_cause_list(where:{type:{_eq:"sub_standard_practices_or_unsafe_acts"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      sub_standard_practices_or_unsafe_conditions:cause_analysis_cause_list(where:{type:{_eq:"sub_standard_practices_or_unsafe_conditions"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      custom_sub_standard_practices_or_unsafe_acts:cause_analysis_cause_list(where:{type:{_eq:"custom_sub_standard_practices_or_unsafe_acts"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      custom_sub_standard_practices_or_unsafe_conditions:cause_analysis_cause_list(where:{type:{_eq:"custom_sub_standard_practices_or_unsafe_conditions"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
`;
exports.incident_investigation_cause_analysis_immediate_fragment = incident_investigation_cause_analysis_immediate_fragment;
//</editor-fold>

//<editor-fold desc="incident_investigation_cause_analysis_root_fragment">
const incident_investigation_cause_analysis_root_fragment = `
  id
      custom_job_factors:cause_analysis_cause_list(where:{type:{_eq:"custom_job_factors"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      custom_personal_factors:cause_analysis_cause_list(where:{type:{_eq:"custom_personal_factors"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      job_factors:cause_analysis_cause_list(where:{type:{_eq:"job_factors"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      personal_factors:cause_analysis_cause_list(where:{type:{_eq:"personal_factors"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
`;
exports.incident_investigation_cause_analysis_root_fragment = incident_investigation_cause_analysis_root_fragment;
//</editor-fold>

//<editor-fold desc="incident_investigation_cause_analysis_fragment">
const incident_investigation_cause_analysis_fragment = `
  id
  immediate_analysis{
    ${incident_investigation_cause_analysis_immediate_fragment}
  }
  root_analysis{
    ${incident_investigation_cause_analysis_root_fragment}
  }
`;
exports.incident_investigation_cause_analysis_fragment = incident_investigation_cause_analysis_fragment;
//</editor-fold>

//<editor-fold desc="incident_investigation_details_fragment">
exports.incident_investigation_details_fragment = `
  id
  created_at
  due_date
  investigation_details
  estimated_costs_damages
  estimated_costs_medical
  estimated_costs_salaries_wages
  estimated_costs_investigations
  estimated_costs_others
  environment_list
  class_list
  protective_equipment_worn_list
  weather_condition_list
  investigation_findings_further_desc
  cause_analysis{
    id
    immediate_analysis{
      ${incident_investigation_cause_analysis_immediate_fragment}
    }
    root_analysis{
      ${incident_investigation_cause_analysis_root_fragment}
    }
  }
  severity{
    id
    consequence
    likelihood
    risk_rating
    risk_rating_score
  }
  distribution_list{
    id
    employee{
      ${employee_personal_details_fragment}
    }
    other_person{
      ${personal_details_other_fragment}
    }
  }
  document_list{
    id
    doc
    investigation_id
  }
  investigation_finding_list{
    id
    desc
    investigation_id
  }
  investigation_team_list{
    id
    investigator{
      ${employee_personal_details_fragment}
    }
    investigator_other{
      ${personal_details_other_fragment}
    }
    investigation_id
  }
  incident_list{
    id
  }
`;
//</editor-fold>
