//<editor-fold desc="getVariablesAndQueryConfig">
const {buildQueryFilter} = require("../../commons_funs");
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,

        ppe_item_id,
        ppe_type_id,

        team_id,
        team_list,
        department_id,
        department_list,
        job_position_id,
        job_position_list,
        employee_id,
        employee_list,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = true,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if (id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if (name) {
            filter.push(`name: {_ilike: "%${name}%"}`);
        }

        const getPathByEmployee = (value) => {
            return `ppe_type:{ppe_item_list:{employee_list: {employee: {${value}}}}}`;
        };

        let filter_job_task_list = [];

        if (ppe_item_id) {
            filter_job_task_list.push(`ppe_type:{ppe_item_list:{id: {_eq: ${ppe_item_id}}}}`);
        }
        if (ppe_type_id) {
            filter_job_task_list.push(`ppe_type_id: {_eq: ${ppe_type_id}}`);
        }

        buildQueryFilter({
            data :{
                team_id,
                team_list,
                department_id,
                department_list,
                job_position_id,
                job_position_list,
                employee_id,
                employee_list,
            },
            filter_list: filter_job_task_list,
            getPathByEmployee,
        });

        if(filter_job_task_list.isNotEmpty()) {
            filter.push(`job_task_list:{job_task:{ppe_type_list:{${filter_job_task_list.join(',')}}}}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="job_task_categories_details_fragment">
exports.job_task_categories_details_fragment = `
  id
  removed
  name
  desc
  
  job_task_list_aggregate{
    aggregate {
      count
    }
  }
  job_task_list{
  	id
    job_task{
        id
    }
  }
`;
//</editor-fold>
