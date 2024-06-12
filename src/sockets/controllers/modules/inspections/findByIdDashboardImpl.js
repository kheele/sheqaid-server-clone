//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    if(!data) return;

    const {removed = false, now, range_start, range_end,} = data;
    const {logged_employee_id, site_id, project_id, client_id, company_id,} = data;
    const id = site_id || project_id || client_id || company_id;
    let tbl;
    if(logged_employee_id) {
        tbl = "hr_employees";
    } else if(site_id) {
        tbl = "default_sites";
    } else if(project_id) {
        tbl = "default_projects";
    } else if(client_id) {
        tbl = "default_clients";
    } else {
        tbl = "default_companies";
    }
    
    // const monStart = range_start || now.addMonths(-12);
    // const monEnd = range_end || now.addMonths(6);
    //
    // const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
    // const dateRangeQueries = dates.map(date => {
    //     const {year, month, start, end} = date;
    //     return `
	// 		_${year}_${month}__expiry_document_list_aggregate: default_contractor_questionnaires_ques_aggregate(
	// 			where: {
	// 				questionnaire: {${where}},
	// 				questionType: {_eq: "Document"},
	// 				expiry: {_gte: "${start}", _lte: "${end}"}
	// 			}
	// 		) {
	// 			aggregate {
	// 			  count
	// 			}
	// 		}
	// 	`;
    // }).join('\n');
    //
    // const mon = Dates.formatDateSQL(now.addMonths(1));
    // const mon2 = Dates.formatDateSQL(now.addMonths(2));
    // const mon3 = Dates.formatDateSQL(now.addMonths(3));

    return getGraphQLOne({
        query: `
            query findByIdOrgInspectionsDashboardQuery {
                ${tbl}(
                  where: {id: {_eq: ${id}},},
                ) {
                    #
                    all_template_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: true}, group: {_eq: "Inspections"}}) {
                        aggregate {
                            count
                        }
                    }
                    all_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}}) {
                        aggregate {
                            count
                        }
                    }
                    all_non_compliant_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(
                        where: {
                            is_template: {_eq: false}, 
                            group: {_eq: "Inspections"},
                            question_list_aggregate: {
                              count:{
                                predicate:{_gt: 0}
                                filter:{
                                  is_deviation: {_eq: true},
                                  _or: [
                                    {has_answer: {_eq: true}},
                                    {options: {answer: {_is_null: false}}}
                                  ]
                                }
                              }
                            }
                        }
                    ) {
                        aggregate {
                            count
                        }
                    }
                    all_asset_list_aggregate: asset_list_aggregate(where: {inspection_and_template_list:{is_template:{_eq: false}}}) {
                        aggregate {
                           count
                        }
                    }
			  
                    #
                    list_interval_unclassified_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, interval: {_is_null: true}}) {
                        aggregate {
                            count
                        }
                    }
                    list_interval_daily_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, interval: {_eq: "Daily"}}) {
                        aggregate {
                            count
                        }
                    }
                    list_interval_weekly_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, interval: {_eq: "Weekly"}}) {
                        aggregate {
                            count
                        }
                    }
                    list_interval_monthly_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, interval: {_eq: "Monthly"}}) {
                        aggregate {
                            count
                        }
                    }
                    list_interval_quarterly_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, interval: {_eq: "Quarterly"}}) {
                        aggregate {
                            count
                        }
                    }
                    list_interval_biannually_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, interval: {_eq: "Bi-Annually"}}) {
                        aggregate {
                            count
                        }
                    }
                    list_interval_annually_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, interval: {_eq: "Annually"}}) {
                        aggregate {
                            count
                        }
                    }
                    
                    #
                    active_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(
                        where: {
                            is_template: {_eq: false}, 
                            group: {_eq: "Inspections"}, 
                            status: {_neq: "CompleteAccepted"},
                            question_list_aggregate: {
                                count: {
                                    predicate: {_gt: 0}, 
                                    filter: {
                                        _or: [
                                            {has_answer: {_eq: true}},
                                            {options: {answer: {_is_null: false}}}
                                        ]
                                    }
                                }
                            } 
                        }
                    ) {
                        aggregate {
                            count
                        }
                    }
                    completed_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, status: {_eq: "CompleteAccepted"}}) {
                        aggregate {
                            count
                        }
                    }
                    completion_requests_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, status: {_eq: "CompleteRequested"}}) {
                        aggregate {
                            count
                        }
                    }
                    declined_requests_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(where: {is_template: {_eq: false}, group: {_eq: "Inspections"}, status: {_eq: "CompleteDeclined"}}) {
                        aggregate {
                            count
                        }
                    }
                    
                    #
                    inspections_compliance
                    
                }
            }
        `,
        operationName: "findByIdOrgInspectionsDashboardQuery",
    });
}
//</editor-fold>
