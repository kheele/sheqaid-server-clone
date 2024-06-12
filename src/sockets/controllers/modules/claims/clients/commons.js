//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		removed = false,
		//
		employee,
		occupation,
		status,
		claim_status,
		//
		accident_date_range,
		resume_date_range,
		// year,
		id,
		mcr_ref_num,
		claim_number,
		// injury_disease,
		// injury_type,
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
			filter.push(`employee_id: {_eq: ${logged_employee_id}}}`);
		}
		
		//
		if (site_id) {
			filter.push(`site_id: {_eq: ${site_id}}`);
		}
		if (project_id) {
			filter.push(`project_id: {_eq: ${project_id}}`);
		}
		if (client_id) {
			filter.push(`client_id: {_eq: ${client_id}}`);
		}
		
		if (isBoolean(removed)) {
			filter.push(`removed: {_eq: ${removed}}`);
		}
		
		if (employee) {
			filter.push(`employee_id: {_eq: ${employee.id}}`);
		}
		if (occupation) {
			filter.push(`wcl_2: {occupation_id: {_eq: ${occupation.id}}}`);
		}
		if (status) {
			filter.push(`status: {_eq: "${status}"}`);
		}
		if (claim_status) {
			filter.push(`claim_status: {_eq: "${claim_status}"}`);
		}
		
		if (accident_date_range) {
			const {start, end} = accident_date_range;
			if (start && end) {
				filter.push(`accident_date: {_gte: "${start}", _lte: "${end}"}`);
			} else if (start) {
				filter.push(`accident_date: {_gte: "${start}"}`);
			} else if (end) {
				filter.push(`accident_date: {_lte: "${end}"}`);
			}
		}
		if (resume_date_range) {
			const {start, end} = resume_date_range;
			if (start && end) {
				filter.push(`wcl_2: {date_resumed_work: {_gte: "${start}", _lte: "${end}"}}`);
			} else if (start) {
				filter.push(`wcl_2: {date_resumed_work: {_gte: "${start}"}}`);
			} else if (end) {
				filter.push(`wcl_2: {date_resumed_work: {_lte: "${end}"}}`);
			}
		}
		
		// if(year) {
		//     filter.push(`category_list: {category_id: {_in: [${category_list.map(v => v.id)}]}}`);
		// }
		if (mcr_ref_num) {
			filter.push(`ref_num: {_eq: "${mcr_ref_num}"}`);
		}
		if (claim_number) {
			filter.push(`claim_number: {_eq: "${claim_number}"}`);
		}
		// if(injury_disease) {
		//     filter.push(`exact_location: {_ilike: "%${exact_location}%"}`);
		// }
		// if(injury_type) {
		//     filter.push(`vehicle_make: {_ilike: "%${vehicle_make}%"}`);
		// }
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="coida_claims_fragment">
exports.coida_claims_fragment = `
    id
    created_at
    
    claim_number
    provincial_office
    accident_date
    doctor_email_1
    
    employee{
      id
      fname
      lname
      full_name
    }
    
    message_list_provider{
      id
      date
      msg
      read
      sender{
        id
        full_name
        fname
        lname
        username
      }
    }
    
    wcl_2{
        id
        company_name
        company_reg_num
        company_str_addr
        company_str_addr_code
        company_postal_addr
        company_postal_addr_code
        company_tel_code
        company_tel_num
        company_fax_code
        company_fax_num
        company_email
        company_location
        company_nature
        company_employee_association
        doc_certified_id
        id_num
        dob
        gender
        marital_status
        citizen_of
        personnel_num
        occupation_id
        employee_str_addr
        employee_str_addr_code
        employee_postal_addr
        employee_postal_addr_code
        employee_tel_code
        employee_tel_num
        period_employ_years
        period_employ_months
        expected_disablement_period
        accident_date
        accident_time
        incident_place
        incident_place_district
        accident_date_reported
        accident_time_reported
        task_employee_performing_during_accident
        period_experience_task_performed_years
        period_experience_task_performed_months
        employee_action_connected_business
        accident_desc
        traffic_accident_on_public_road
        nature_of_injury_list
        nature_of_injury_options
        employee_injured_explanation_satisfactory
        employee_injured_explanation_satisfactory_nope_desc
        doc_salary_slip
        earning_list
        prepared_further_payments_after_3_months_4rm_accident_date
        period_payments_made_range_date_from
        period_payments_made_range_date_to
        num_of_week_days_worked_by_employee
        date_ceased_work
        time_ceased_work
        did_employee_complete_shift_on_date_work_ceased
        date_resumed_work
        time_resumed_work
        dependant_name
        dependant_address
        previously_received_compensation_full_names
        was_1st_aid_given
        medical_practitioner_or_chiropractor_who_treated_employee
        hospital_which_treated_employee
        was_accidnt_caused_by_employee_options_1
        was_accidnt_caused_by_employee_options_2
        was_accidnt_caused_by_employee_options_3
        accident_witness
        accident_aware_person
        num_of_employees_involved_in_accident
        accident_police_station
        accident_docket_num
        involved_vehicle_reg_numbers
        contributing_factor_list_a
        contributing_factor_list_b
        other_machinery_list
        other_contributing_factor_list
        additional_details_or_comments
        employer_signature
        employer_signature_name
        employer_signature_date
        company_contact_person_id
        company_contact_person_other_id
        incident_place_province_id
        totalFieldCount
        totalFieldMax
        contributing_factor_list_A
        contributing_factor_list_B
        total_amount_already_paid
    }
    wcl_4{
        id
        claim_number
        accident_date
        company_name
        company_str_addr
        company_str_addr_code
        id_num
        employee_str_addr
        employee_str_addr_code
        first_consultation_date
        how_accident_happen
        injury_clinical_desc
        pre_existing_defect_disease
        x_rays_date
        x_rays_conducting_person
        surgical_procedure_date
        surgical_procedure_conducting_person
        surgical_procedure_desc
        anaesthetics_general_or_local
        anaesthetics_dur
        consultation_yes_or_no
        consultation_date
        consultation_conducting_person
        physiotherapy_employee_referred_yes_or_no
        physiotherapy_conducting_person
        employee_fitness_yes_or_no
        employee_fitness_light_duty_date
        employee_fitness_normal_duty_date
        practioner_signature
        practioner_signature_name
        practioner_signature_date
        practioner_addr
        practioner_practice_num
        totalFieldCount
        totalFieldMax
        x_rays_report
        external_doc
    }
    wcl_5_list{
      id
      wcl_5{
        id
        doctor_email
        external_doc
        claim_number
        accident_date
        company_name
        company_str_addr
        company_str_addr_code
        id_num
        employee_str_addr
        employee_str_addr_code
        prognosis_and_further_treatment
        employee_been_fit_normal_work_date
        employee_likely_to_be_fit_normal_work_date
        employee_condition_became_stabilised_yes_or_no
        present_permanent_anatomical_defect_or_impairment
        practioner_signature
        practioner_signature_name
        practioner_signature_date
        practioner_addr
        practioner_practice_num
        operation_procedure_test_carried_out_and_dates
        totalFieldCount
        totalFieldMax
      }
    }
    wcl_6{
        id
        claim_number
        accident_date
        company_name
        company_str_addr
        company_str_addr_code
        id_num
        employee_str_addr
        employee_str_addr_code
        employee_light_duty_available_and_offered
        employee_perform_recommended_light_duty
        employee_perform_recommended_light_duty_not_performed_reason
        employee_perform_recommended_light_duty_performed_percentage
        employee_still_in_your_employment
        employee_left_my_service_date
        employee_present_address
        employer_signature
        employer_signature_name
        employer_signature_date
        periods_employee_off_duty
        periods_employee_light_duty
        employee_receive_free_food_range
        employee_receive_free_quarters_range
        period_detained_in_hospital_range
        totalFieldCount
        totalFieldMax
    }
    annexture_1{
        id
        company_name
        id_num
        accident_date
        accident_time
        effect_on_person
        expected_period_of_disablement
        disease_desc
        process
        incident_reported_compensationcommissioner__provincial_director
        incident_reported_police
        saps_office
        saps_reference
        substance_exposed_to
        investigation_date
        investigator_designation
        incident_desc
        incident_cause
        steps_to_prevent_recurrence
        investigator_signature
        investigator_signature_date
        employer_preventative_action_for_recurrence_of_similar_incident
        employer_signature
        employer_signature_date
        health_and_safety_committee_remarks
        chairperson_of_health_and_safety_committee_signature
        chairperson_of_health_and_safety_committee_signature_date
        investigator_id
        investigator_other_id
        totalFieldCount
        totalFieldMax
        part_of_body_affected
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
`;
//</editor-fold>
