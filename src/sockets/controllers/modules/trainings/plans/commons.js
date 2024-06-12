//<editor-fold desc="getVariablesAndQueryConfig">
const {employee_personal_details_fragment} = require("../../../../../graphql/Fragments");
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        completion_status,
        result_status,
        result,
        date_range,
        course_id,
        training_id,
        trainer_id,
        job_position_id,
        employee_id,
        year,
        //
        view = 'Course',
        employee_view = 'active',
        target_view,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    // const {id, target} = target_view || {};

    if (view === 'Employee') {
        if (employee_id) {
            filter.push(`id: {_eq: ${employee_id}}`);
        } else {
            if (employee_view && employee_view !== "all") {
                filter.push(`removed: {_eq: ${employee_view === 'active'}}`);
            }
            
            if (year) {
                filter.push(`training_plan_list:{year: {_eq: ${year}}}`);
            }
            if (course_id) {
                filter.push(`training_plan_list:{course_id: {_eq: ${course_id}}}`);
            }
            if (training_id) {
                filter.push(`training_plan_list:{training_id: {_eq: ${training_id}}}`);
            }
            if (trainer_id) {
                filter.push(`training_plan_list:{training: {trainer_id: {_eq: ${trainer_id}}}}`);
            }
            if (job_position_id) {
                filter.push(`job_position_id: {_eq: ${job_position_id}}`);
            }

            if (completion_status) {
                filter.push(`training_plan_list:{completion_status: {_eq: "${completion_status}"}}`);
            }
            if (result_status) {
                filter.push(`training_plan_list:{result_status: {_eq: "${result_status}"}}`);
            }
            if (result) {
                filter.push(`training_plan_list:{result: {_eq: ${result}}}`);
            }
            if (date_range) {
                const {start, end} = date_range;
                if(start && end) {
                    filter.push(`training_plan_list:{
                        training:{
                            date_range_start: {_gte: "${start}"},
                            date_range_end: {_lte: "${end}"}
                        }
                    }`);
                } else if(start) {
                    filter.push(`training_plan_list:{training:{date_range_start: {_gte: "${start}"}}}`);
                } else if(end) {
                    filter.push(`training_plan_list:{training:{date_range_end: {_lte: "${end}"}}}`);
                }
            }
        }
    } else if (view === 'Job Position') {
        if (job_position_id) {
            filter.push(`id: {_eq: ${job_position_id}}`);
        } else {
            if (year) {
                filter.push(`training_plan_list:{year: {_eq: ${year}}}`);
            }
            if (course_id) {
                filter.push(`training_plan_list:{course_id: {_eq: ${course_id}}}`);
            }
            if (training_id) {
                filter.push(`training_plan_list:{training_id: {_eq: ${training_id}}}`);
            }
            if (trainer_id) {
                filter.push(`training_plan_list:{training:{trainer_id: {_eq: ${trainer_id}}}}`);
            }
            if (employee_id) {
                filter.push(`employee_list:{id: {_eq: ${employee_id}}}`);
            } else {
                if (employee_view && employee_view !== "all") {
                    filter.push(`employee_list:{removed: {_eq: ${employee_view === 'active'}}}`);
                }
            }

            if (completion_status) {
                filter.push(`completion_status: {_eq: "${completion_status}"}`);
            }
            if (result_status) {
                filter.push(`result_status: {_eq: "${result_status}"}`);
            }
            if (result) {
                filter.push(`result: {_eq: ${result}}`);
            }
            if (date_range) {
                const {start, end} = date_range;
                if(start && end) {
                    filter.push(`training_plan_list:{
                        training:{
                            date_range_start: {_gte: "${start}"},
                            date_range_end: {_lte: "${end}"}
                        }
                    }`);
                } else if(start) {
                    filter.push(`training_plan_list:{training:{date_range_start: {_gte: "${start}"}}}`);
                } else if(end) {
                    filter.push(`training_plan_list:{training:{date_range_end: {_lte: "${end}"}}}`);
                }
            }
        }
    } else if (view === 'Course') {
        if (course_id) {
            filter.push(`id: {_eq: ${course_id}}`);
        } else {
            if (year) {
                filter.push(`training_plan_list:{year: {_eq: ${year}}}`);
            }
            if (training_id) {
                filter.push(`training_matrix_list:{id: {_eq: ${training_id}}}`);
            }
            if (trainer_id) {
                filter.push(`training_matrix_list:{trainer_id: {_eq: ${trainer_id}}}`);
            }
            if (job_position_id) {
                filter.push(`training_plan_job_position_list:{job_position_id: {_eq: ${job_position_id}}}`);
            }
            if (employee_id) {
                filter.push(`training_plan_list:{employee_id: {_eq: ${employee_id}}}`);
            } else {
                if (employee_view && employee_view !== "all") {
                    filter.push(`training_plan_list:{employee:{removed: {_eq: ${employee_view === 'active'}}}}`);
                }
            }

            if (completion_status) {
                filter.push(`training_plan_list:{completion_status: {_eq: "${completion_status}"}}`);
            }
            if (result_status) {
                filter.push(`training_plan_list:{result_status: {_eq: "${result_status}"}}`);
            }
            if (result) {
                filter.push(`training_plan_list:{result: {_eq: ${result}}}`);
            }
            if (date_range) {
                const {start, end} = date_range;
                if(start && end) {
                    filter.push(`training_matrix_list:{
                        date_range_start: {_gte: "${start}"},
                        date_range_end: {_lte: "${end}"}
                    }`);
                } else if(start) {
                    filter.push(`training_matrix_list:{date_range_start: {_gte: "${start}"}}`);
                } else if(end) {
                    filter.push(`training_matrix_list:{date_range_end: {_lte: "${end}"}}`);
                }
            }
        }
    } else if (view === 'Year') {
        if (year) {
            filter.push(`year: {_eq: ${year}}`);
        } else {
            if (course_id) {
                filter.push(`course_list:{id: {_eq: ${course_id}}}`);
            }
            if (training_id) {
                filter.push(`training_list:{id: {_eq: ${training_id}}}`);
            }
            if (trainer_id) {
                filter.push(`training_list:{trainer_id: {_eq: ${trainer_id}}}`);
            }
            if (job_position_id) {
                filter.push(`employee_list:{job_position_id: {_eq: ${job_position_id}}}`);
            }
            if (employee_id) {
                filter.push(`employee_list:{id: {_eq: ${employee_id}}}`);
            } else {
                if (employee_view && employee_view !== "all") {
                    filter.push(`employee_list:{removed: {_eq: ${employee_view === 'active'}}}`);
                }
            }

            if (completion_status) {
                filter.push(`completion_status: {_eq: "${completion_status}"}`);
            }
            if (result_status) {
                filter.push(`training_plan_list:{result_status: {_eq: "${result_status}"}}`);
            }
            if (result) {
                filter.push(`training_plan_list:{result: {_eq: ${result}}}`);
            }
            if (date_range) {
                const {start, end} = date_range;
                if(start && end) {
                    filter.push(`training_plan_list:{
                        training:{
                            date_range_start: {_gte: "${start}"},
                            date_range_end: {_lte: "${end}"}
                        }
                    }`);
                } else if(start) {
                    filter.push(`training_plan_list:{training:{date_range_start: {_gte: "${start}"}}}`);
                } else if(end) {
                    filter.push(`training_plan_list:{training:{date_range_end: {_lte: "${end}"}}}`);
                }
            }
        }
    } else {
        if (year) {
            filter.push(`year: {_eq: ${year}}`);
        }
        if (course_id) {
            filter.push(`course_id: {_eq: ${course_id}}`);
        }
        if (training_id) {
            filter.push(`training_id: {_eq: ${training_id}}`);
        }
        if (trainer_id) {
            filter.push(`trainer_id: {_eq: ${trainer_id}}`);
        }
        if (job_position_id) {
            filter.push(`job_position_id: {_eq: ${job_position_id}}`);
        }
        if (employee_id) {
            filter.push(`employee_id: {_eq: ${employee_id}}`);
        } else {
            if (employee_view && employee_view !== "all") {
                filter.push(`employee:{removed: {_eq: ${employee_view === 'active'}}}`);
            }
        }

        if (completion_status) {
            filter.push(`completion_status: {_eq: "${completion_status}"}`);
        }
        if (result_status) {
            filter.push(`result_status: {_eq: "${result_status}"}`);
        }
        if (result) {
            filter.push(`result: {_eq: ${result}}`);
        }
        // if (date_range) {
        //     filter.push(`date: {_gte: ${date_range.start}, _lte: ${date_range.end}}`);
        // }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="training_plans_view_each_plan_details_fragment">
exports.training_plans_view_each_plan_details_fragment = `
    id
    created_at
    completion_status
    result_status
    result
    
    year
    
    employee{
        ${employee_personal_details_fragment}
    }
    course {
        id
        name
    }
    # job_position {
    #     id
    #     name
    # }
    training {
        id
        course {
            id
            name
        }
    }
`;
//</editor-fold>

//<editor-fold desc="training_plans_employee_details_fragment">
exports.training_plans_employee_details_fragment = `
    id
    lname
    fname
    profile_pic
    job_position{
      id
      name
    }
    course_list_count: training_plan_list_aggregate {
      aggregate {
        count(distinct: true, columns: course_id)
      }
    }
    year_list: training_plan_list(distinct_on: year, order_by: {year: asc}) {
      year
    }
    completion_status_not_started_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "Not Started"}}) {
      aggregate {
        count
      }
    }
    completion_status_outstanding_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "Outstanding"}}) {
      aggregate {
        count
      }
    }
    completion_status_in_progress_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "In Progress"}}) {
      aggregate {
        count
      }
    }
    completion_status_completed_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "Completed"}}) {
      aggregate {
        count
      }
    }
    results_passed_list_count: training_plan_list_aggregate(where: {result: {_gte: 50}}) {
      aggregate {
        count
      }
    }
    results_failed_list_count: training_plan_list_aggregate(where: {result: {_lt: 50}}) {
      aggregate {
        count
      }
    }
    results_status_passed_list_count: training_plan_list_aggregate(where: {result_status: {_eq: "Passed"}}) {
      aggregate {
        count
      }
    }
    results_status_failed_list_count: training_plan_list_aggregate(where: {result_status: {_eq: "Failed"}}) {
      aggregate {
        count
      }
    }
    results_average_list_count: training_plan_list_aggregate {
      aggregate {
        avg {
          result
        }
      }
    }
`;
//</editor-fold>

//<editor-fold desc="training_plans_job_position_details_fragment">
exports.training_plans_job_position_details_fragment = `
    id
    name
    #attendance_list
    course_list_count: training_plan_list_aggregate {
      aggregate {
        count(distinct: true, columns: course_id)
      }
    }
    year_list: training_plan_list(distinct_on: year, order_by: {year: asc}) {
      year
    }
    #training_list: training_plan_list(distinct_on: course, order_by: {course: asc}) {
    #  course: {
    #  	id
    #  	name
    #  }
    #}
    employee_list_count: employee_list_aggregate(where: {training_plan_list_aggregate: {count: {predicate: {_gt: 0}}}}) {
      aggregate {
        count
      }
    }
    training_cost
    
    results_failed
    results_passed
    results_average
    status_not_started
    status_in_progress
    status_outstanding
    status_completed
`;
//</editor-fold>

//<editor-fold desc="training_plans_course_details_fragment">
exports.training_plans_course_details_fragment = `
    id
    name
    job_position_list_count: training_plan_job_position_list_aggregate {
      aggregate {
        count(distinct: true, columns: job_position_id)
      }
    }
    training_cost: training_matrix_list_aggregate {
      aggregate {
        sum {
          cost
        }
      }
    }
    employee_list_count: training_plan_list_aggregate {
      aggregate {
        count(distinct: true, columns: employee_id)
      }
    }
    training_list_count: training_matrix_list_aggregate {
      aggregate {
        count
      }
    }
    year_list: training_plan_list(distinct_on: year, order_by: {year: asc}) {
      year
    }
    completion_status_not_started_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "Not Started"}}) {
      aggregate {
        count
      }
    }
    completion_status_outstanding_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "Outstanding"}}) {
      aggregate {
        count
      }
    }
    completion_status_in_progress_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "In Progress"}}) {
      aggregate {
        count
      }
    }
    completion_status_completed_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "Completed"}}) {
      aggregate {
        count
      }
    }
    results_passed_list_count: training_plan_list_aggregate(where:{result:{_gte: 50}}) {
      aggregate {
        count
      }
    }
    results_failed_list_count: training_plan_list_aggregate(where:{result:{_lt: 50}}) {
      aggregate {
        count
      }
    }
    results_status_passed_list_count: training_plan_list_aggregate(where:{result_status:{_eq: "Passed"}}) {
      aggregate {
        count
      }
    }
    results_status_failed_list_count: training_plan_list_aggregate(where:{result_status:{_eq: "Failed"}}) {
      aggregate {
        count
      }
    }
    results_average_list_count: training_plan_list_aggregate {
      aggregate {
        avg{
          result
        }
      }
    }
`;
//</editor-fold>

//<editor-fold desc="training_plans_year_details_fragment">
exports.training_plans_year_details_fragment = `
    year
    training_cost
    course_list_count
    job_position_list_count
    employee_list_count
    attendance_list_count
    training_list_count
        
    results_failed
    results_passed
    results_average
    status_not_started
    status_in_progress
    status_outstanding
    status_completed
`;
//</editor-fold>
