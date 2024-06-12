
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

//<editor-fold desc="departments_details_fragment">
exports.departments_details_fragment = `
  id
  created_at
  name
  removed
  ppe_type_list_aggregate{
    aggregate{
      count
    }
  }
  employee_list_aggregate{
    aggregate{
      count
    }
  }
  responsible_document_list_aggregate{
    aggregate{
      count
    }
  }
`;
//</editor-fold>
