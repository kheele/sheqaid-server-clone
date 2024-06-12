
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
    orgs_filter = [],
    //
    id,
    //
    job_position_list,
    job_position_id,
    trainer_list,
    trainer_id,
    course_list,
    course_id,
    training_frequency,
    unit_standard,
    provider_requirement,
    requirement,
    status,
    //
    site_id, project_id, client_id,
    //
    exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(id) {
    filter.push(`id: {_eq: ${id}}`);
    } else {
    //
    if (job_position_list) {
      filter.push(`job_position_list:{job_position_id: {_in: [${job_position_list.map(v => v.id)}]}}`);
    }
    if (job_position_id) {
      filter.push(`job_position_list:{job_position_id: {_eq: ${job_position_id}}}`);
    }
    if(trainer_list) {
      filter.push(`trainer_id: {_in: [${trainer_list.map(v => v.id)}]}`);
    }
    if (trainer_id) {
      filter.push(`trainer_id: {_eq: ${trainer_id}}`);
    }
    if(course_list) {
      filter.push(`course_id: {_in: [${course_list.map(v => v.id)}]}`);
    }
    if (course_id) {
      filter.push(`course_id: {_eq: ${course_id}}`);
    }

    if(training_frequency) {
      filter.push(`training_frequency: {_eq: "${training_frequency}"}`);
    }
    if(unit_standard) {
      filter.push(`unit_standard: {_ilike: "%${unit_standard}%"}`);
    }
    if(provider_requirement) {
      filter.push(`provider_requirement: {_eq: "${provider_requirement}"}`);
    }
    if(requirement) {
      filter.push(`requirement: {_eq: "${requirement}"}`);
    }
    if(status) {
      filter.push(`status: {_eq: "${status}"}`);
    }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="training_matrix_details_fragment">
exports.training_matrix_details_fragment = `
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
    full_name
    email
    phone
  }
  trainer_external{
    id
    fname
    lname
    full_name
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
  
  competency_list{
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
      fname
      lname
      full_name
      phone
      email
      id_num
      passport_num
    }
  }
  job_category_list{
    id
    job_category{
      id
      name
    }
  }
  job_position_list{
    id
    job_position{
      id
      name
    }
  }
  sector_list{
    id
    sector{
      id
      name
    }
  }
  training_plan_list{
    completion_status
    result
    result_status
    year
    employee{
      id
      fname
      lname
      full_name
      email
      phone
      id_num
      passport_num
      employment_num
      job_position{
        id
        name
      }
      department{
        id
        name
      }
    }
    course {
      id
      name
    }
    training{
      id
      course{
        id
        name
      }
    }
  }
  training_register_list{
    id
    date
    time_or_duration
    list_proof
    institution_conducting_training
    trainer{
      id
      fname
      lname
      full_name
      email
      phone
    }
    trainer_external{
      id
      fname
      lname
      full_name
      email
      phone
    }
    employee_list{
      employee{
        id
        fname
        lname
        full_name
        email
        phone
      }
    }
  }
`;
//</editor-fold>
