
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_list,
        job_position_id,
        sector_list,
        sector_id,
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
        if(name) {
            filter.push(`name: {_ilike: "%${name}%"}`);
        }
        if(unit_standard) {
            filter.push(`unit_standard: {_ilike: "%${unit_standard}%"}`);
        }
        if(frequency) {
            filter.push(`frequency: {_eq: "${frequency}"}`);
        }
        if(provider) {
            filter.push(`provider: {_eq: "${provider}"}`);
        }
        if (job_position_list) {
            filter.push(`job_position_list:{job_position_id: {_in: [${job_position_list.map(v => v.id)}]}}`);
        }
        if (job_position_id) {
            filter.push(`job_position_list:{job_position_id: {_eq: ${job_position_id}}}`);
        }
        if (sector_list) {
            filter.push(`sector_list:{sector_id: {_in: [${sector_list.map(v => v.id)}]}}`);
        }
        if (sector_id) {
            filter.push(`sector_list:{sector_id: {_eq: ${sector_id}}}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="training_course_details_fragment">
exports.training_course_details_fragment = `
  id
  created_at
                
  name
  frequency
  provider
  unit_standard
  unit_standard_desc
                
  job_position_list {
    id
    job_position{
      id
      name
    }
  }
  sector_list {
    id
    sector{
      id
      name
    }
  }
                
  training_manual_list {
    id
  }
  training_matrix_list {
    id
    cost
    institution_conducting_training
    trainer {
      id
    }
  }
  training_plan_list{
    #id
    completion_status
    result
    result_status
    year
    employee{
        id
        fname
        lname
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
`;
//</editor-fold>
