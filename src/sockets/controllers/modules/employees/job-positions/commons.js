
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,
        job_category_id,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = true,
        exact_orgs_company = true,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if (job_category_id) {
            filter.push(`job_category_id: {_eq: ${job_category_id}}`);
        }

        //
        if (name) {
            filter.push(`name: {_ilike: "%${name}%"}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="job_positions_details_fragment">
exports.job_positions_details_fragment = `
  id
  created_at
  name
  desc
  doc
  job_position_owner
  employee_list_aggregate{
    aggregate{
      count
    }
  }
  employee_external_list_aggregate{
    aggregate{
      count
    }
  }
  ppe_type_list_aggregate{
    aggregate{
      count
    }
  }
  toolbox_talk_list_aggregate{
    aggregate{
      count
    }
  }
  training_plan_list_aggregate{
    aggregate{
      count
    }
  }
  job_category {
    id
    name
  }
`;
//</editor-fold>
