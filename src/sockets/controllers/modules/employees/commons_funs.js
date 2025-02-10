exports.buildQueryFilter = (
    {
        getPathByEmployee,
        filter_list,
        filter,
        data,
    }
) => {
    let filter_job_task_employee_list = [];

    const {
        job_task_id,
        team_list, team_id,
        department_list, department_id,
        job_position_list, job_position_id,
        employee_list, employee_id,
    } = data;

    if (team_list) {
        filter_job_task_employee_list.push(`team_id: {_in: [${team_list.map(v => v.id).join(', ')}]}`);
    }
    if (team_id) {
        filter_job_task_employee_list.push(`team_id: {_eq: ${team_id}}`);
    }

    if (department_list) {
        filter_job_task_employee_list.push(`department_id: {_in: [${department_list.map(v => v.id).join(', ')}]}`);
    }
    if (department_id) {
        filter_job_task_employee_list.push(`department_id: {_eq: ${department_id}}`);
    }

    if (job_position_list) {
        filter_job_task_employee_list.push(`job_position_id: {_in: [${job_position_list.map(v => v.id).join(', ')}]}`);
    }
    if (job_position_id) {
        filter_job_task_employee_list.push(`job_position_id: {_eq: ${job_position_id}}`);
    }

    if (employee_list) {
        filter_job_task_employee_list.push(`id:{_in: [${employee_list.map(v => v.id).join(', ')}]}`);
    }
    if (employee_id) {
        filter_job_task_employee_list.push(`id:{_eq: ${employee_id}}`);
    }

    if (filter_job_task_employee_list.isNotEmpty()) {
        filter_list.push(getPathByEmployee(filter_job_task_employee_list.join(',')));
    }

    if (job_task_id) {
        let job_task_filter = filter_job_task_list => {
            return `job_task:{ppe_type_list:{${filter_job_task_list.join(',')}}}`;
        };

        if (filter_list.isNotEmpty()) {
            filter.push(`
						job_task_list:{
							job_task_id: {_eq: ${job_task_id}},
							${job_task_filter(filter_list)}
						}
					`);
        } else {
            filter.push(`job_task_list:{job_task_id: {_eq: ${job_task_id}}}`);
        }
    }
};
