//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    if(!data) return;

    let {date,} = data;
    const {site_id, project_id, client_id, company_id,} = data;
    const id = site_id || project_id || client_id || company_id;
    let tbl;
    if(site_id) {
        tbl = "default_sites";
    } else if(project_id) {
        tbl = "default_projects";
    } else if(client_id) {
        tbl = "default_clients";
    } else {
        tbl = "default_companies";
    }

    date = Dates.parse(date);
    const  start = Dates.formatDateSQL(date);
    const  end = Dates.formatDateSQL(date.addDays(30));

    // const {start, end} = date_range;
    // const monStart = start || new Date().addMonths(-12);
    // const monEnd = end || new Date().addMonths(6);
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
    // const mon = Dates.formatDateSQL(new Date().addMonths(1));
    // const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
    // const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

    return getGraphQLOne({
        multi_queries: true,
        count: true,
        query: `
            query findByIdOrgDashboardQuery {
                ${tbl}(
                  where: {id: {_eq: ${id}},},
                ) {
                    #
                    new_employee_list_aggregate: employee_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            employment_date: {_gte: "${start}", _lte: "${end}"}
                        }
                    ) {
                        aggregate {
                            count
                        }
                    }
                    new_asset_list_aggregate: asset_list_aggregate(
                        where: {
                            written_off: {_eq: false},
                            created_at: {_gte: "${start}", _lte: "${end}"}
                        }
                    ) {
                        aggregate {
                           count
                        }
                    }
                    new_claim_list_aggregate: claim_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            accident_date: {_gte: "${start}", _lte: "${end}"}
                        }
                    ) {
                        aggregate {
                           count
                        }
                    }
                    
                    #
                    nearmiss_incident_list_aggregate: incident_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            incident_date: {_gte: "${start}", _lte: "${end}"},
                            sub_category_list: {sub_category:{name: {_eq: "Near miss"}}}
                        }
                    ) {
                        aggregate {
                            count
                        }
                    }
                    lti_incident_list_aggregate: incident_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            incident_date: {_gte: "${start}", _lte: "${end}"},
                            group: {_eq: "Reportable (LTI)"}
                        }
                    ) {
                        aggregate {
                           count
                        }
                    }
                    vehicle_incident_list_aggregate: incident_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            incident_date: {_gte: "${start}", _lte: "${end}"},
                            is_vehicle_incident: {_eq: true}
                        }
                    ) {
                        aggregate {
                           count
                        }
                    }
                    
                    #
                    open_incident_list_aggregate: incident_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            status_closed: {_eq: false}
                        }
                    ) {
                        aggregate {
                            count
                        }
                    }
                    open_ncr_list_aggregate: non_conformance_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            status_progress: {_neq: "Completed"}
                        }
                    ) {
                        aggregate {
                           count
                        }
                    }
                    open_claim_list_aggregate: claim_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            claim_status: {_neq: "Closed"}
                        }
                    ) {
                        aggregate {
                           count
                        }
                    }
                    
                    #
                    active_questionnaire_list_aggregate: contractor_questionnaire_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            is_template: {_eq: false}, 
                            group: {_eq: "Contractors"}, 
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
                    active_inspection_list_aggregate: contractor_questionnaire_list_aggregate(
                        where: {
                            removed: {_eq: false},
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
                    
                    #
                    expired_document_list_aggregate: document_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            doc_version_list:{expiry: {_gte: "${start}", _lte: "${end}"}}
                        }
                    ) {
                        aggregate {
                            count
                        }
                    }
                    
                    #
                    all_compliance_audit_list: compliance_audit_list_aggregate(
                        where: {
                            removed: {_eq: false},
                            date: {_gte: "${start}", _lte: "${end}"}
                        }
                    ) {
                        aggregate {
                            count
                        }
                    }
                }
            }
        `,
        operationName: "findByIdOrgDashboardQuery",
    });
}
//</editor-fold>