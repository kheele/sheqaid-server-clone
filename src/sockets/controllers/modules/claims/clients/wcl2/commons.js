
//<editor-fold desc="coida_claims_wcl_2_fragment">
exports.coida_claims_wcl_2_fragment = `
    id
    
    totalFieldCount
    totalFieldMax
    
    #1. Employer Details
    company_name
    company_reg_num
    company_contact_person{
       id
       fname
       lname
       full_name
    }
    company_contact_person_other{
       id
       fname
       lname
       full_name
    }
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
    
    #2. Employee Details
    company_employee_association
    doc_certified_id
    id_num
    dob
    gender
    marital_status
    citizen_of
    personnel_num
    occupation{
       id
       name
    }
    employee_str_addr
    employee_str_addr_code
    employee_postal_addr
    employee_postal_addr_code
    employee_tel_code
    employee_tel_num
    period_employ_years
    period_employ_months
    expected_disablement_period
    
    #3. Accident Details
    #       incident_source
    #       incident
    accident_date
    accident_time
    incident_place
    incident_place_province{
       id
       name
    }
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
    
    #4. Further Particulars Of Employee
    doc_salary_slip
    earning_list
    prepared_further_payments_after_3_months_4rm_accident_date
    total_amount_already_paid
    period_payments_made_range_date_from
    period_payments_made_range_date_to
    period_payments_made_range
    num_of_week_days_worked_by_employee
    date_ceased_work
    time_ceased_work
    did_employee_complete_shift_on_date_work_ceased
    date_resumed_work
    time_resumed_work
    dependant_name
    dependant_address
    
    #5. Further Particulars
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
    contributing_factor_list_A
    contributing_factor_list_B
    other_machinery_list
    other_contributing_factor_list
    additional_details_or_comments
    
    #6. Employer's Declaration
    employer_signature
    employer_signature_name
    employer_signature_date
`;
//</editor-fold>