const {orgs_fragment, orgs_id_fragment} = require("../../../../../graphql/Fragments");
const {
    getVariablesAndQueryConfig,
    training_plans_view_each_plan_details_fragment,
    training_plans_employee_details_fragment,
    training_plans_job_position_details_fragment,
    training_plans_course_details_fragment,
    training_plans_year_details_fragment,
} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    console.log('plans data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
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
        //
        client_filter,
        orgs_filter = [],
    } = data;

    const {filter} = getVariablesAndQueryConfig({
        orgs_filter,
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
        view,
        employee_view,
        target_view,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    const {id, target} = target_view || {};

    if (target === 'employee') {
        return targetEmployee(id);
    } else if (target === 'job_position') {
        return targetJobPosition(id);
    } else if (target === 'course') {
        return targetCourse(id);
    } else if (target === 'year') {
        return targetYear(id);
    } else {
        if (view === 'Employee') {
            return viewEmployee(filter, offset, limit);
        } else if (view === 'Job Position') {
            return viewJobPosition(filter, offset, limit);
        } else if (view === 'Course') {
            return viewCourse(filter, offset, limit);
        } else if (view === 'Year') {
            return viewYear(filter, offset, limit);
        } else {
            return viewEachPlan(filter, offset, limit);
        }
    }
}
//</editor-fold>

function viewEachPlan(filter, offset, limit) {
    return listGraphQL({
        query: `
                    query listAllTrainingPlanByLoggedQuery {
                        sheq_training_plans__employee_training(
                            where: {
                                ${filter},
                            },  
                            offset: ${offset},
                            limit: ${limit}
                        ) {
                            ${training_plans_view_each_plan_details_fragment}
                            ${orgs_fragment}
                        }
                    }
                `,
    });
}

function targetEmployee(id) {
    return listGraphQL({
        query: `
                query listOneGroupByEmployeePlanByLoggedQuery {
                    hr_employees(
                        where: { 
                            id: {_eq: ${id}}, 
                        },
                    ) {
                        ${training_plans_employee_details_fragment}
                        ${orgs_id_fragment}
                    }
                }
            `,
        operationName: "listAllTrainingPlansByLoggedQuery",
    });
}

function targetJobPosition(id) {
    return listGraphQL({
        query: `
                query listOneGroupByJobPositionPlanByLoggedQuery {
                	default_job_positions(
                        where: {
                        	id: {_eq: ${id}},
                        }
                    ) {
                    	${training_plans_job_position_details_fragment}
                    	${orgs_id_fragment}
                    }
                }
            `,
        operationName: "listAllTrainingPlansByLoggedQuery",
    });
}

function targetCourse(id) {
    return listGraphQL({
        query: `
                query listOneGroupByCoursePlanByLoggedQuery {
                    sheq_training_courses(
                        where: {
                            id: {_eq: ${id}}
                        }
                    ) {
                        ${training_plans_course_details_fragment}
                    	${orgs_id_fragment}
                    }
                }
            `,
        operationName: "listAllTrainingPlansByLoggedQuery",
    });
}

function targetYear(year) {
    return listGraphQL({
        query: `
                query listOneGroupByYearPlanByLoggedQuery {
                    sheq_training_plans_per_year(
                        where: {
            				${filter},
                            year: {_eq: ${year}}
                        }
                    ) {
                       ${training_plans_year_details_fragment}
                       ${orgs_id_fragment}
                    }
                }
            `,
        operationName: "listAllTrainingPlansByLoggedQuery",
    });
}

function viewEmployee(filter, offset, limit) {
    return listGraphQL({
        query: `
                    query listAllGroupByEmployeePlanByLoggedQuery {
                        hr_employees(
                            where: {
                            	training_plan_list_aggregate: {count: {predicate: {_gt: 0}}},
                                ${filter}
                            },  
                            order_by: [{lname: asc_nulls_last}, {fname: asc_nulls_last}],
                            offset: ${offset},
                            limit: ${limit}
                        ) {
                            ${training_plans_employee_details_fragment}
                            ${orgs_id_fragment}
                        }
                    }
                `,
        operationName: "listAllTrainingPlansByLoggedQuery",
    });
}

function viewJobPosition(filter, offset, limit) {
    return listGraphQL({
        query: `
                    query listAllGroupByJobPositionPlanByLoggedQuery {
                        default_job_positions(
                            where: {
                            	training_plan_list_aggregate: {count: {predicate: {_gt: 0}}},
            					${filter}
                            },  
                            order_by: {name: asc_nulls_last},
                            offset: ${offset},
                            limit: ${limit}
                        ) {
                        	${training_plans_job_position_details_fragment}
                            ${orgs_id_fragment}
                        }
                    }
                `,
        operationName: "listAllTrainingPlansByLoggedQuery",
    });
}

function viewCourse(filter, offset, limit) {
    return listGraphQL({
        query: `
                    query listAllGroupByCoursePlanByLoggedQuery {
                        sheq_training_courses(
                            where: {
                            	_and: {
									_or: [
										{training_plan_list_aggregate: {count: {predicate: {_gt: 0}}}},
										{training_plan_job_position_list_aggregate: {count: {predicate: {_gt: 0}}}}
									],
                            	},
            					${filter}
                            },  
                            order_by: [{name: asc_nulls_last}, {unit_standard: asc_nulls_last}, {unit_standard_desc: asc_nulls_last}],
                            offset: ${offset},
                            limit: ${limit}
                        ) {
                            ${training_plans_course_details_fragment}
                            ${orgs_id_fragment}
                        }
                    }
                `,
        operationName: "listAllTrainingPlansByLoggedQuery",
    });
}

function viewYear(filter, offset, limit) {
    return listGraphQL({
        query: `
                    query listAllGroupByYearPlanByLoggedQuery {
                        sheq_training_plans_per_year(
                            where: {
            					${filter}
                            },
                            order_by: {year: asc},
                            offset: ${offset},
                            limit: ${limit}
                        ) {
                        	${training_plans_year_details_fragment}
                            ${orgs_id_fragment}
                        }
                    }
                `,
        operationName: "listAllTrainingPlansByLoggedQuery",
    });
}
