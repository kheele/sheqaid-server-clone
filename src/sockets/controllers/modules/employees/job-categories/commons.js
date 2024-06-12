
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,
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
        if (name) {
            filter.push(`name: {_ilike: "%${name}%"}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="job_categories_details_fragment">
exports.job_categories_details_fragment = `
  id
  created_at
  name
  job_category_owner
  job_position_list_aggregate{
    aggregate{
      count
    }
  }
`;
//</editor-fold>
