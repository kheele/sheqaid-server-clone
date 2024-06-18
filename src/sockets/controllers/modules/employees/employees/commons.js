
//<editor-fold desc="getVariablesAndQueryConfig">
const {signable_doc_template_details_fragment} = require("../../../general/doc-signing-settings/templates/commons");
const {signable_doc_submitter_details_fragment} = require("../../../general/doc-signing-settings/submitters/commons");
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        excludeIds,
        id,
        //
        incContractors = false,
        department_id,
        job_position_id,
        job_category_id,
        team_id,
        supervisor_id,
        name,
        id_or_pass_num,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    console.log("orgsFilter orgs_filter", orgs_filter);
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if(excludeIds) {
            filter.push(`_not: {id: {_in: [${excludeIds}]}}`);
        }
        //
        if (department_id) {
            filter.push(`department_id: {_eq: ${department_id}}`);
        }
        if (job_position_id) {
            filter.push(`job_position_id: {_eq: ${job_position_id}}`);
        }
        if (job_category_id) {
            filter.push(`job_position: {job_category_id: {_eq: ${job_category_id}}}`);
        }
        if (team_id) {
            filter.push(`team_id: {_eq: ${team_id}}`);
        }
        if (supervisor_id) {
            filter.push(`supervisor_id: {_eq: ${supervisor_id}}`);
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
                } else if(name) {
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
                } else if(name) {
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
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="employee_details_fragment">
exports.employee_details_fragment = `
  id
  created_at,
  removed
  fname
  lname
  full_name
  email
  phone
  dob
  sex
  id_num
  passport_num
  profile_pic
  employment_num
  employment_date

  job_observation_list_aggregate(where: {removed: {_eq: false}}){
    aggregate{
      count
    }
  }
  job_observation_list{
    id
    name
  }
  
  banking_detail_list_aggregate{
    aggregate{
      count
    }
  }
  banking_detail_list{
    id
    created_at
    name
    account_num
    code
    branch
    doc
    is_default
  }
  living_address_list_aggregate{
    aggregate{
      count
    }
  }
  living_address_list{
    id
    created_at
    local_address
    street_address
    doc
    is_default
    country{
      id
      name
    }
    zone{
      id
      name
    }
    city{
      id
      name
    }
  }
  dependent_list_aggregate{
    aggregate{
      count
    }
  }
  dependent_list{
    id
    fname
    lname
    dob
    gender
  }
  next_of_kin_list_aggregate{
    aggregate{
      count
    }
  }
  next_of_kin_list{
    id
    fname
    lname
    phone1
    phone2
    relationship
    
  }
  
  signable_doc_submitter_list{
    ${signable_doc_submitter_details_fragment}
  }

  training_course_list_aggregate: training_plan_list_aggregate {
    aggregate {
      count(distinct: true, columns: course_id)
    }
  }
  training_course_list: training_plan_list(distinct_on: [course_id]) {
    #id
    course{
      id
      name
      unit_standard
      unit_standard_desc
    }
  }
  training_plan_list_aggregate: training_plan_list_aggregate {
    aggregate {
      count
    }
  }
  training_plan_list{
    #id
    created_at
    completion_status
    result_status
    result

    year
    course {
      id
      name
    }
    training {
      id
      course {
        id
        name
      }
    }
  }

  training_matrix_list_aggregate: training_plan_list_aggregate {
    aggregate {
      count(distinct: true, columns: training_id)
    }
  }
  training_matrix_list: training_plan_list(distinct_on: [training_id]) {
    #id
    training {
      id
      date_range_start
      date_range_end
      training_standard
      unit_standard
      unit_standard_desc
      credits
      nqf_level
      requirement
      provider_requirement
      requirement_legal
      training_frequency
      cost
      course {
        id
        name
        unit_standard
        unit_standard_desc
      }
    }
  }

  competency_list_aggregate(where: {removed: {_eq: false}}){
    aggregate{
      count
    }
  }
  competency_list(where: {removed: {_eq: false}}){
    id
    created_at
    accreditation_num
    competency_type
    type
    doc
    issued_date
    expiry_date
    expiry_updated
    employee{
      id
    }
    training{
      id
      course{
        id
        name
      }
    }
  }
  contract_list_aggregate(where: {removed: {_eq: false}}){
    aggregate{
      count
    }
  }
  contract_list(where: {removed: {_eq: false}}){
    id
    created_at
    doc
    job_profile_doc
    expiry_updated
    removed
    employee{
      id
    }
    contract_details{
      id
      contract_type
      daily_working_hours
      end_of_trial_period
      end_time
      expiry_date
      notes
      start_date
      start_time
    }
    salary_info{
      id
      deductible_list{
        id
        created_at
        text
        value
      }
      payment_type
      salary
      salary_interval
      wage
    }
    signable_doc_template_list{
        ${signable_doc_template_details_fragment}
    }
  }
  counselling_list_aggregate(where: {removed: {_eq: false}}){
    aggregate{
      count
    }
  }
  counselling_list(where: {removed: {_eq: false}}){
    id
    created_at
    doc
    corrective_actions
    counselling_hrs_to_complete
    expiry_date
    expiry_updated
    removed
    incident_desc
    reasons
    types
    responsible_person{
      id
      fname
      lname
      email
      phone
      id_num
      passport_num
      profile_pic
      employment_num
    }
    witness_list{
      id
      witness{
        id
        fname
        lname
        email
        phone
        id_num
        passport_num
        profile_pic
        employment_num
      }
    }
    signable_doc_template_list{
        ${signable_doc_template_details_fragment}
    }
  }
  job_appointment_list_aggregate(where: {removed: {_eq: false}}){
    aggregate{
      count
    }
  }
  job_appointment_list(where: {removed: {_eq: false}}){
    id
    created_at
    removed
    notes
    doc
    date
    expiry_date
    expiry_updated
  }
  leave_list_aggregate(where: {removed: {_eq: false}}){
    aggregate{
      count
    }
  }
  leave_list(where: {removed: {_eq: false}}){
    id
    created_at
    days_booked
    due_to
    removed
    type
    employee_comments
    reason
    notes
    doc
    date
    expiry_date
    expiry_updated
  }
  license_list_aggregate{
    aggregate{
      count
    }
  }
  license_list(where: {removed: {_eq: false}}){
    id
    created_at
    removed
    notes
    doc
    date
    expiry_date
    expiry_updated
  }
  medical_list_aggregate(where: {removed: {_eq: false}}){
    aggregate{
      count
    }
  }
  medical_list(where: {removed: {_eq: false}}){
    id
    created_at
    removed
    annexture_3
    restrictions
    doc
    expiry_date
    expiry_updated
  }
  warning_list_aggregate(where: {removed: {_eq: false}}){
    aggregate{
      count
    }
  }
  warning_list(where: {removed: {_eq: false}}){
    id
    created_at
    removed
    type
    details
    employee_comments
    notes
    doc
    date
    expiry_date
    expiry_updated
    witness_list{
      id
      witness{
        id
        fname
        lname
        email
        phone
        id_num
        passport_num
        profile_pic
        employment_num
      }
    }
    issued_by{
      id
      fname
      lname
      email
      phone
      id_num
      passport_num
      profile_pic
      employment_num
    }
    signable_doc_template_list{
        ${signable_doc_template_details_fragment}
    }
  }
  work_permit_list_aggregate{
    aggregate{
      count
    }
  }
  work_permit_list(where: {removed: {_eq: false}}){
    id
    created_at
    removed
    notes
    doc
    date
    expiry_date
    expiry_updated
  }

  document_list_aggregate{
    aggregate{
      count
    }
  }
  document_id_passport_list_aggregate:document_list_aggregate(where: {type: {_eq: "ID/Passport"}}){
    aggregate{
      count
    }
  }
  document_prdp_list_aggregate:document_list_aggregate(where: {type: {_eq: "PrDP"}}){
    aggregate{
      count
    }
  }
  document_list{
    id
    created_at
    expiry_date
    type
    desc
    doc
  }
  ppe_type_list_aggregate(where: {ppe_type: {removed: {_eq: false}}}){
    aggregate{
      count
    }
  }
  ppe_item_list_aggregate(where: {ppe_item:{removed: {_eq: false}}}){
    aggregate{
      count
    }
  }
  ppe_type_list(where: {ppe_type: {removed: {_eq: false}}}){
    id
    created_at
    ppe_type {
      id
      removed
      created_at
      name
      unit
      duration_type
      duration_value
      notes
      profile_pic
    }
  }
  ppe_item_list(where: {ppe_item:{removed: {_eq: false}}}){
    id
    created_at
    assignment_status
    date_assigned
    ppe_condition
    ppe_item {
      id
      removed
      created_at
      purchase_date
      condition
      serial_num
      ppe_type{
        id
        removed
        created_at
        name
        unit
        duration_type
        duration_value
        notes
        profile_pic
      }
      notes
      profile_pic
    }
  }
  trainer_training_list_aggregate:trainer_training_matrix_list_aggregate{
    aggregate{
      count
    }
  }
  trainer_training_list:trainer_training_matrix_list{
    id
    created_at
    competency_evaluation
    cost
    credits
    date_range_start
    date_range_end
    institution_conducting_training
    max_participants_per_course
    nqf_level
    provider_requirement
    requirement
    requirement_legal
    status
    training_frequency
    training_standard
    unit_standard
    unit_standard_desc

    trainer{
      id
      fname
      lname
      email
      phone
    }
    trainer_external{
      id
      fname
      lname
      email
      phone
    }
    trainer_job_position{
      id
      name
    }
    course{
      id
      name
    }
  }
  supervisor_employee_list_aggregate(where: {removed: {_eq: false}}){
    aggregate{
      count
    }
  }
  supervisor_employee_list(where: {removed: {_eq: false}}){
    id
    fname
    lname
    email
    phone
    id_num
    passport_num
    profile_pic
    employment_num
  }
  
  supervisor{
    id
    fname
    lname
    email
    phone
    id_num
    passport_num
    profile_pic
    employment_num
  }
  linked_user {
    id
    fname
    lname
    username
    phone
  }
  department {
    id
    name
  }
  job_position {
    id
    name
    job_category{
      id
      name
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
