
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        job_position_list,
        trainer_list,
        course_list,
        unit_standard,
        date,
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
        if (job_position_list) {
            filter.push(`training:{job_position_list:{job_position_id: {_in: [${job_position_list.map(({id}) => id).join(', ')}]}}}`);
        }
        if(trainer_list) {
            filter.push(`trainer_id: {_in: [${trainer_list.map(({id}) => id).join(', ')}]}`);
        }
        if(course_list) {
            filter.push(`training:{course_id: {_in: [${course_list.map(({id}) => id).join(', ')}]}}`);
        }
        if(unit_standard) {
            filter.push(`training:{
              _or:[
                {unit_standard: {_ilike: "%${unit_standard}%"}},
                {course:{unit_standard: {_ilike: "%${unit_standard}%"}}}
              ]
            }`);
        }
        if(date) {
            filter.push(`date: {_eq: "${date}"}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="training_register_details_fragment">
exports.training_register_details_fragment = `
  id
  created_at
  date
  time_from
  time_to
  institution_conducting_training
  time_or_duration
  list_proof
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
  training{
    id
    course {
      id
      name
    }
    training_plan_list{
      year
      course_id
      employee_id
    }
    job_position_list{
      id
      job_position{
        id
        name
      }
    }
  }
  employee_list{
    id
    employee{
      id
      fname
      lname
      full_name
      email
      phone
    }
  }
`;
//</editor-fold>
