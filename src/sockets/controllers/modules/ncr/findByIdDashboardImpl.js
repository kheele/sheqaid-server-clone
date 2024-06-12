//<editor-fold desc="dashboard">
module.exports = async (socket, data) => {
	if (!data) return;
	
	const {removed = false, now, range_start, range_end,} = data;
	const {site_id, project_id, client_id, company_id, contractor_id, contractor_site_id,} = data;
	const id = site_id || project_id || client_id || company_id;
	let tbl;
	if (site_id) {
		tbl = "default_sites";
	} else if (project_id) {
		tbl = "default_projects";
	} else if (client_id) {
		tbl = "default_clients";
	} else {
		tbl = "default_companies";
	}
	
	const due_date = Dates.formatDateSQL(now);
	
	const monStart = range_start || now.addMonths(-12);
	const monEnd = range_end || now;
	
	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	const dateRangeQueries = dates.map(async date => {
		const {year, month, start, end} = date;
		return getGraphQLOne({
			query: `
	      query findByIdOrgNCRDashboardQuery_${year}_${month} {
	        ${tbl}(
	          where: {
	            id: {_eq: ${id}}
	          }
	        ) {
				    _${year}_${month}__all_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}}) {
							aggregate {
							  count
							}
						}
						#
						_${year}_${month}__source_site_audit_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, source: {_eq: "Site Audit"}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__source_compliance_audit_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, source: {_eq: "Compliance Audit"}}) {
						  aggregate {
							  count
							}
						}
						_${year}_${month}__source_inspection_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, source: {_eq: "Inspection"}}) {
						  aggregate {
						    count
						  }
						}
						_${year}_${month}__source_incident_investigation_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, source: {_eq: "Incident Investigation"}}) {
						  aggregate {
						    count
						  }
						}
						
						#
						_${year}_${month}__priority_non_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, priority: {_is_null: true}}) {
						  aggregate {
							  count
							}
						}
						_${year}_${month}__priority_low_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, priority: {_eq: "Low"}}) {
						  aggregate {
							  count
							}
						}
						_${year}_${month}__priority_medium_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, priority: {_eq: "Medium"}}) {
						  aggregate {
							  count
							}
						}
						_${year}_${month}__priority_high_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, priority: {_eq: "High"}}) {
						  aggregate {
							  count
							}
						}
						_${year}_${month}__priority_critical_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, priority: {_eq: "Critical"}}) {
						  aggregate {
							  count
							}
						}
						
						#
						_${year}_${month}__type_corrective_action_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, type: {_eq: "Corrective Action"}}) {
						  aggregate {
							  count
							}
						}
						_${year}_${month}__type_preventative_action_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, type: {_eq: "Preventative Action"}}) {
						  aggregate {
							  count
							}
						}
						_${year}_${month}__type_opportunity_for_improver_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, type: {_eq: "Opportunity For Improver"}}) {
						  aggregate {
							  count
							}
						}
						_${year}_${month}__type_non_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {due_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, type: {_is_null: true}}) {
						  aggregate {
							  count
							}
						}
				  }
	      }
      `,
			operationName: `findByIdOrgNCRDashboardQuery_${year}_${month}`,
		}).then(res => [res]);
	});
	
	return Promise.all([
		getGraphQLOne({
			query: `
	      query findByIdOrgNCRDashboardQuery {
	        ${tbl}(
	          where: {
	            id: {_eq: ${id}}
	          }
	        ) {
				    #
				    all_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}}) {
				      aggregate {
				        count
				      }
				    }
				    source_site_audit_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, source: {_eq: "Site Audit"}}) {
				      aggregate {
				        count
				      }
				    }
				    source_compliance_audit_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, source: {_eq: "Compliance Audit"}}) {
				      aggregate {
				        count
				      }
				    }
				    source_inspection_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, source: {_eq: "Inspection"}}) {
				      aggregate {
				        count
				      }
				    }
				    source_incident_investigation_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, source: {_eq: "Incident Investigation"}}) {
				      aggregate {
				        count
				      }
				    }
				    
				    #
				    priority_non_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, priority: {_is_null: true}}) {
				      aggregate {
				        count
				      }
				    }
				    priority_low_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, priority: {_eq: "Low"}}) {
				      aggregate {
				        count
				      }
				    }
				    priority_medium_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, priority: {_eq: "Medium"}}) {
				      aggregate {
				        count
				      }
				    }
				    priority_high_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, priority: {_eq: "High"}}) {
				      aggregate {
				        count
				      }
				    }
				    priority_critical_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, priority: {_eq: "Critical"}}) {
				      aggregate {
				        count
				      }
				    }
				    
				    #
				    acceptance_status_pending_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, status_acceptance: {_eq: "Pending"}}) {
				      aggregate {
				        count
				      }
				    }
				    acceptance_status_approved_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, status_acceptance: {_eq: "Approved"}}) {
				      aggregate {
				        count
				      }
				    }
				    acceptance_status_rejected_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, status_acceptance: {_eq: "Rejected"}}) {
				      aggregate {
				        count
				      }
				    }
				    acceptance_status_non_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, status_acceptance: {_is_null: true}}) {
				      aggregate {
				        count
				      }
				    }
				    
				    #
				    status_pending_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, status_progress: {_eq: "Pending"}}) {
				      aggregate {
				        count
				      }
				    }
				    status_progressed_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, status_progress: {_eq: "Progressed"}}) {
				      aggregate {
				        count
				      }
				    }
				    status_completed_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, status_progress: {_eq: "Completed"}}) {
				      aggregate {
				        count
				      }
				    }
				    status_non_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, status_progress: {_is_null: true}}) {
				      aggregate {
				        count
				      }
				    }
				    
				    #
				    status_open_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, _or:[{status_progress: {_is_null: true}}, {status_progress: {_neq: "Completed"}}]}) {
				      aggregate {
				        count
				      }
				    }
				    status_closed_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, status_progress: {_eq: "Completed"}}) {
				      aggregate {
				        count
				      }
				    }
				    
				    #
				    result_passed_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, result: {_eq: "Pass"}}) {
				      aggregate {
				        count
				      }
				    }
				    result_failed_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, result: {_eq: "Fail"}}) {
				      aggregate {
				        count
				      }
				    }
				    result_non_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, result: {_is_null: true}}) {
				      aggregate {
				        count
				      }
				    }
				    
				    #
				    type_corrective_action_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, type: {_eq: "Corrective Action"}}) {
				      aggregate {
				        count
				      }
				    }
				    type_preventative_action_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, type: {_eq: "Preventative Action"}}) {
				      aggregate {
				        count
				      }
				    }
				    type_opportunity_for_improver_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, type: {_eq: "Opportunity For Improver"}}) {
				      aggregate {
				        count
				      }
				    }
				    type_non_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, type: {_is_null: true}}) {
				      aggregate {
				        count
				      }
				    }
				    
				    #
				    due_date_passed_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, _or:[{status_progress: {_is_null: true}}, {status_progress: {_neq: "Completed"}}], due_date: {_lte: "${due_date}"}}) {
				      aggregate {
				        count
				      }
				    }
				    due_date_notpassed_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false},  _or:[{status_progress: {_is_null: true}}, {status_progress: {_neq: "Completed"}}], due_date: {_gt: "${due_date}"}}) {
				      aggregate {
				        count
				      }
				    }
				    due_date_non_ncr_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, due_date: {_is_null: true}}) {
				      aggregate {
				        count
				      }
				    }
				  }
	      }
	    `,
			operationName: "findByIdOrgNCRDashboardQuery",
		}).then(res => [res]),
		...dateRangeQueries,
	]).then(res => res.
	reduce((a1, a2) => [...a1, ...a2], []).
	reduce((o, a) => ({...o, ...a}), {}));
}
//</editor-fold>
