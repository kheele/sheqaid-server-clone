
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,
        supervisor_id,
        employee_id,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = true,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if (name) {
            filter.push(`name: {_ilike: "%${name}%"}`);
        }

        if (supervisor_id) {
            filter.push(`supervisor_id: {_eq: ${supervisor_id}}`);
        }

        if (employee_id) {
            filter.push(`employee_list: {id: {_eq: ${employee_id}}}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="teams_details_fragment">
exports.teams_details_fragment = `    
  id
  created_at
  name
  status
  
  supervisor {
    id
    fname
    lname
    email
    phone
    job_position{
      id
      name
    }
  }
  employee_list_aggregate{
    aggregate{
      count
    }
  }
  ppe_type_list_aggregate{
    aggregate{
      count
    }
  }
`;
//</editor-fold>

//<editor-fold desc="teams_details_one_fragment">
exports.teams_details_one_fragment = `    
  id
  created_at
  name
  status
  
  supervisor {
    id
    fname
    lname
    email
    phone
    job_position{
      id
      name
    }
  }
  employee_list_aggregate{
    aggregate{
      count
    }
  }
  ppe_type_list_aggregate{
    aggregate{
      count
    }
  }
  
  employee_list{
    id
    fname
    lname
    full_name
    email
    phone
  }
          
  ppe_type_list{
    id
    ppe_type{
      name
      profile_pic
    }
  }
`;
//</editor-fold>
