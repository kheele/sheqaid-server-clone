
//<editor-fold desc="getVariablesAndQueryConfig">
const {employee_basic_personal_details_fragment} = require("../../../../../graphql/Fragments");
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,
        unit,
        team_id,
        department_id,
        job_position_id,
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

        if (unit) {
            filter.push(`unit: {_ilike: "%${unit}%"}`);
        }

        if (team_id) {
            filter.push(`team_list: {team_id: {_eq: ${team_id}}}`);
        }

        if (department_id) {
            filter.push(`department_list: {department_id: {_eq: ${department_id}}}`);
        }

        if (job_position_id) {
            filter.push(`job_position_list: {job_position_id: {_eq: ${job_position_id}}}`);
        }

        if (employee_id) {
            filter.push(`_and: {
                _or: [
                    {team_list:{team:{employee_list: {id: {_eq: ${employee_id}}}}}},
                    {department_list:{department:{employee_list: {id: {_eq: ${employee_id}}}}}},
                    {job_position_list:{job_position:{employee_list: {id: {_eq: ${employee_id}}}}}},
                ]
            }`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="ppe_item_one_details_fragment">
exports.ppe_item_one_details_fragment = `
  id
  created_at
  removed
  serial_num
  purchase_date
  condition
  notes
  profile_pic

  ppe_type{
    id
    name
    unit
  }

  employee_list{
    employee{
      ${employee_basic_personal_details_fragment}
    }
  }

  employee_list_aggregate{
    aggregate {
      count
    }
  }
`;
//</editor-fold>

//<editor-fold desc="ppe_item_details_fragment">
exports.ppe_item_details_fragment = `
  id
  created_at
  removed
  serial_num
  purchase_date
  condition
  notes
  profile_pic
  
  ppe_type{
    id
    name
    unit
  }

  employee_list_aggregate{
    aggregate {
      count
    }
  }
`;
//</editor-fold>
