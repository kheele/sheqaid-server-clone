//<editor-fold desc="getVariablesAndQueryConfig">
const {buildQueryFilter} = require("../commons_funs");
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,

        regulation_id,
        job_task_id,
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

        let job_task_filter = filter_job_task_list => {
            return `job_task:{ppe_type_list:{${filter_job_task_list.join(',')}}}`;
        };

        let filter_job_task_list = [];

        if (regulation_id) {
            filter.push(`applicable_regulation_list:{regulation_id: {_eq: ${regulation_id}}}`);
        }

        if (ppe_item_id) {
            filter_job_task_list.push(`ppe_type:{ppe_item_list:{id: {_eq: ${ppe_item_id}}}}`);
        }
        if (ppe_type_id) {
            filter_job_task_list.push(`ppe_type_id: {_eq: ${ppe_type_id}}`);
        }

        buildQueryFilter({
            data: {
                job_task_id,
                //
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
            filter,
            job_task_filter,
            getPathByEmployee,
        });

        if (!job_task_id && filter_job_task_list.isNotEmpty()) {
            filter.push(`job_task_list:{${job_task_filter(filter_job_task_list)}}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="compliance_requirements_details_fragment">
exports.compliance_requirements_details_fragment = `
  id
  removed
  name
  desc
  
  applicable_regulation_list_aggregate{
    aggregate {
      count
    }
  }
  job_task_list_aggregate{
    aggregate {
      count
    }
  }
  
  applicable_regulation_list{
  	id
    regulation{
        id
        code
        desc
        jurisdiction
        effective_date
    }
  }
  job_task_list{
  	id
  	notes
    job_task{
        id
        name
        desc
        priority_level
        estimated_duration
    }
  }
`;
//</editor-fold>
