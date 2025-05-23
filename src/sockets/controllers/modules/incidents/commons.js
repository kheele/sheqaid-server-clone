const {
	employee_personal_details_fragment,
	personal_details_other_fragment, employee_basic_personal_details_fragment,
} = require("../../../../graphql/Fragments");

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

//<editor-fold desc="incident_details_one_fragment">
exports.incident_details_one_fragment = incident_details_one_fragment = `
  id
  removed
  group
  short_desc
  desc
  location
  exact_location
  incident_date
  incident_time
  date_reported
  time_reported
  time_shift
  injury_desc
  severity{
    id
    consequence
    likelihood
    risk_rating
    risk_rating_score
  }
  person_reporting{
    ${employee_personal_details_fragment}
  }
  person_reporting_other{
    ${personal_details_other_fragment}
  }
  person_reported_to{
    ${employee_personal_details_fragment}
  }
  person_reported_to_other{
    ${personal_details_other_fragment}
  }
  person_injured{
    ${employee_personal_details_fragment}
  }
  person_injured_other{
    ${personal_details_other_fragment}
  }
  injured_person_dob
  injured_person_gender
  test_type_drug_undertaken
  test_type_alcohol_undertaken
  test_type_mobile_device_undertaken
  is_person_injured
  is_vehicle_incident
  test_undertaken
  status_closed
  status_approved
  status_approved_investigation
  status_awaiting_approval
  status_investigating
  status_awaiting_investigation_approval
  investigation{
    id
    due_date
    severity{
        id
        consequence
        likelihood
        risk_rating
        risk_rating_score
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
  }
  activity_list{
    id
    activity{
      id
      name
      sector{
        id
        name
      }
    }
  }
  category_list{
    category{
      id
      name
    }
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
    incident_id
  }
  nature_of_injury_list:injury_list(where: {injury:{type: {_eq: "Nature"}}}){
    injury{
      id
      type
      name
    }
  }
  bodily_injury_location_list:injury_list(where: {injury:{type: {_eq: "Bodily Parts"}}}){
    injury{
      id
      type
      name
    }
  }
  injury_mechanism_list:injury_list(where: {injury:{type: {_eq: "Direct Cause"}}}){
    injury{
      id
      type
      name
    }
  }
  ncr_list{
    id
    removed
    approving_person{
      ${employee_personal_details_fragment}
    }
    responsible_person{
      ${employee_personal_details_fragment}
    }
    created_at
    comments
    completed_date
    desc
    due_date
    process
    remarks
    type
  }
  person_involved_list{
    id
    person_involved{
      ${employee_personal_details_fragment}
    }
    person_involved_other{
      ${personal_details_other_fragment}
    }
  }
  sector_list{
    id
    sector{
      id
      name
    }
  }
  sub_category_list{
    sub_category{
      id
      name
      category{
        id
        name
      }
    }
  }
  test_type_list{
    id
    name
  }
  vehicle_list{
    id
    driver{
      ${employee_personal_details_fragment}
    }
    driver_other{
      ${personal_details_other_fragment}
    }
    driver_dob
    driver_gender
    address
    email
    phone
    licence_num
    licence_expiry
    licence_years
    vehicle_make
    vehicle_model
    vehicle_year
    vehicle_color
    vehicle_reg_num
    vehicle_fleet_num
    vehicle_reg_date
    vehicle_trip_type
    vehicle_load_type
    was_3rd_party_involved
    are_3rd_party_details_available
    third_party_fname
    third_party_lname
    third_party_address
    third_party_email
    third_party_phone
    did_driver_admit_liability
    did_someone_else_admit_liability
    someone_else_admit_liability_name
    liability_admitted_to_name
    third_party_opinion
    is_infringement_issued
    penalty_num
    issuing_authority
    issuing_officer
    type_of_breach
    addressee_issued_to_name
    addressee_name_or_entity
    addressee_amount
    addressee_due_date
    did_police_attend_scene
    ref_or_report_num
    officer_name
    officer_station
    collision_reported_to_police_station
    have_charges_been_laid
    nature_of_charges
    who_laid_charges
    who_were_nature_charges_laid_against
  }
  witness_list{
    id
    witness{
      ${employee_basic_personal_details_fragment}
    }
    witness_other{
      ${personal_details_other_fragment}
    }
  }
  
  contractor_site{
    id
    name
  }
  contractor {
    id
    name
  }
`;
//</editor-fold>

exports.incident_details_export_fragment = incident_details_one_fragment;

//<editor-fold desc="incident_details_fragment">
exports.incident_details_fragment = `
  id
  removed
  group
  short_desc
  desc
  location
  exact_location
  incident_date
  incident_time
  date_reported
  time_reported
  time_shift
  injury_desc
  severity{
    id
    consequence
    likelihood
    risk_rating
    risk_rating_score
  }
  person_reporting{
    ${employee_personal_details_fragment}
  }
  person_reporting_other{
    ${personal_details_other_fragment}
  }
  person_reported_to{
    ${employee_personal_details_fragment}
  }
  person_reported_to_other{
    ${personal_details_other_fragment}
  }
  person_injured{
    ${employee_personal_details_fragment}
  }
  person_injured_other{
    ${personal_details_other_fragment}
  }
  injured_person_dob
  injured_person_gender
  test_type_drug_undertaken
  test_type_alcohol_undertaken
  test_type_mobile_device_undertaken
  is_person_injured
  is_vehicle_incident
  test_undertaken
  status_closed
  status_approved
  status_approved_investigation
  status_awaiting_approval
  status_investigating
  status_awaiting_investigation_approval
  investigation{
    id
    due_date
    severity{
        id
        consequence
        likelihood
        risk_rating
        risk_rating_score
    }
  }
  category_list{
    category{
      id
      name
    }
  }
  sub_category_list{
    sub_category{
      id
      name
      category{
        id
        name
      }
    }
  }
  
  contractor_site{
    id
    name
  }
  contractor {
    id
    name
  }
`;
//</editor-fold>

`
query listAllIncidentsByLoggedQuery {
	sheq_incident_investigation(
		where: {
			removed: {_eq: false},
			company_id: {_eq: 18},
			_or: [
				{client_id: {_eq: 7}}
			]
		},
		order_by: {incident_date: desc, incident_time: desc, group: asc, short_desc: asc},
		offset: 0,
		limit: 50
	) {
			id
			removed
			group
			short_desc
			desc
			location
			exact_location
			incident_date
			incident_time
			date_reported
			time_reported
			time_shift
			injury_desc
			severity{
			  id
			  consequence
			  likelihood
			  risk_rating
			  risk_rating_score
			}
			person_reporting{
			  
			  id
			  created_at
			  profile_pic
			  fname
			  lname
			  full_name
			  dob
			  sex
			  phone
			  email
			  id_num
			  passport_num
			  employment_num
			  employment_date
			  removed
			  job_position{
			    id
			    name
			  }
			  department{
			    id
			    name
			  }
			  team{
			    id
			    name
			  }
			  linked_user_id
			  linked_user{
			    id
			    auth_id
			    created_at
			    profile_pic
			    fname
			    lname
			    full_name
			    phone
			    username
			  }
			}
			person_reporting_other{
			  
			  id
			  created_at
			  fname
			  lname
			  full_name
			  id_num
			  passport_num
			  email
			  phone
			  job_position{
			    id
			    name
			  }
			}
			person_reported_to{
			  
			  id
			  created_at
			  profile_pic
			  fname
			  lname
			  full_name
			  dob
			  sex
			  phone
			  email
			  id_num
			  passport_num
			  employment_num
			  employment_date
			  removed
			  job_position{
			    id
			    name
			  }
			  department{
			    id
			    name
			  }
			  team{
			    id
			    name
			  }
			  linked_user_id
			  linked_user{
			    id
			    auth_id
			    created_at
			    profile_pic
			    fname
			    lname
			    full_name
			    phone
			    username
			  }
			}
			person_reported_to_other{
			  
			  id
			  created_at
			  fname
			  lname
			  full_name
			  id_num
			  passport_num
			  email
			  phone
			  job_position{
			    id
			    name
			  }
			}
			person_injured{
			  
			  id
			  created_at
			  profile_pic
			  fname
			  lname
			  full_name
			  dob
			  sex
			  phone
			  email
			  id_num
			  passport_num
			  employment_num
			  employment_date
			  removed
			  job_position{
			    id
			    name
			  }
			  department{
			    id
			    name
			  }
			  team{
			    id
			    name
			  }
			  linked_user_id
			  linked_user{
			    id
			    auth_id
			    created_at
			    profile_pic
			    fname
			    lname
			    full_name
			    phone
			    username
			  }
			}
			person_injured_other{
			  
			  id
			  created_at
			  fname
			  lname
			  full_name
			  id_num
			  passport_num
			  email
			  phone
			  job_position{
			    id
			    name
			  }
			}
			injured_person_dob
			injured_person_gender
			test_type_drug_undertaken
			test_type_alcohol_undertaken
			test_type_mobile_device_undertaken
			is_person_injured
			is_vehicle_incident
			test_undertaken
			status_closed
			status_approved
			status_approved_investigation
			status_awaiting_approval
			status_investigating
			status_awaiting_investigation_approval
			investigation{
			  id
			  due_date
			  severity{
			      id
			      consequence
			      likelihood
			      risk_rating
			      risk_rating_score
			  }
			}
			category_list{
			  category{
			    id
			    name
			  }
			}
			sub_category_list{
			  sub_category{
			    id
			    name
			    category{
			      id
			      name
			    }
			  }
			}
			
			contractor_site{
			  id
			  name
			}
			contractor {
			  id
			  name
			}
			
			company {
			  id
			  name
			}
			client {
			  id
			  name
			}
			project {
			  id
			  name
			}
			site {
			  id
			  name
			}
		}
}
`
