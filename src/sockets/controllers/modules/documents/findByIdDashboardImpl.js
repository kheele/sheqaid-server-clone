//<editor-fold desc="listImpl">
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
	
	const monStart = range_start || now.addMonths(-12);
	const monEnd = range_end || now;
	
	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	const dateRangeQueries = dates.map(date => {
		const {year, month, start, end} = date;
		return `
			_${year}_${month}__all_expiry_document_list_aggregate: document_list_aggregate(
				where: {
					removed: {_eq: false},
					doc_version_list: {expiry: {_gte: "${start}", _lte: "${end}"}}
				}
			) {
				aggregate {
				  count
				}
			}
			_${year}_${month}__project_plan_expiry_document_list_aggregate: document_list_aggregate(
				where: {
					removed: {_eq: false},
					doc_version_list: {expiry: {_gte: "${start}", _lte: "${end}"}},
					doc_type: {_eq: "Project Plan"}
				}
			) {
				aggregate {
				  count
				}
			}
			_${year}_${month}__ims_policy_expiry_document_list_aggregate: document_list_aggregate(
				where: {
					removed: {_eq: false},
					doc_version_list: {expiry: {_gte: "${start}", _lte: "${end}"}},
					doc_type: {_eq: "IMS Policy"}
				}
			) {
				aggregate {
				  count
				}
			}
			_${year}_${month}__certificate_expiry_document_list_aggregate: document_list_aggregate(
				where: {
					removed: {_eq: false},
					doc_version_list: {expiry: {_gte: "${start}", _lte: "${end}"}},
					doc_type: {_eq: "Company Certificate"}
				}
			) {
				aggregate {
				  count
				}
			}
			_${year}_${month}__insurance_expiry_document_list_aggregate: document_list_aggregate(
				where: {
					removed: {_eq: false},
					doc_version_list: {expiry: {_gte: "${start}", _lte: "${end}"}},
					doc_type: {_eq: "Company Insurance"}
				}
			) {
				aggregate {
				  count
				}
			}
			_${year}_${month}__registration_expiry_document_list_aggregate: document_list_aggregate(
				where: {
					removed: {_eq: false},
					doc_version_list: {expiry: {_gte: "${start}", _lte: "${end}"}},
					doc_type: {_eq: "Company Registration"}
				}
			) {
				aggregate {
				  count
				}
			}
			_${year}_${month}__regulatorybody_expiry_document_list_aggregate: document_list_aggregate(
				where: {
					removed: {_eq: false},
					doc_version_list: {expiry: {_gte: "${start}", _lte: "${end}"}},
					doc_type: {_eq: "Company Regulatory Body"}
				}
			) {
				aggregate {
				  count
				}
			}
			_${year}_${month}__unclassified_expiry_document_list_aggregate: document_list_aggregate(
				where: {
					removed: {_eq: false},
					doc_version_list: {expiry: {_gte: "${start}", _lte: "${end}"}},
					doc_type: {_is_null: true}
				}
			) {
				aggregate {
				  count
				}
			}
		`;
	}).join('\n');
	
	const mon = Dates.formatDateSQL(new Date().addMonths(1));
	const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
	const mon3 = Dates.formatDateSQL(new Date().addMonths(3));
	
	return getGraphQLOne({
		variables: {mon, mon2, mon3},
		query: `
      query findByIdOrgDocumentsDashboardQuery($mon: date, $mon2: date, $mon3: date) {
        ${tbl}(
          where: {
            id: {_eq: ${id}}
          }
        ) {
			    #
			    active_document_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    removed_document_list_aggregate: document_list_aggregate(where: {removed: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    }
			    all_project_plan_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_type: {_eq: "Project Plan"}}) {
			      aggregate {
			        count
			      }
			    }
			    all_ims_policy_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_type: {_eq: "IMS Policy"}}) {
			      aggregate {
			        count
			      }
			    }
			    all_other_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_type: {_nin: ["Project Plan", "IMS Policy"]}}) {
			      aggregate {
			        count
			      }
			    }
			    shared_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}, shared_doc_list: {id: {_is_null: false}}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    doc_type_unclassified_incident_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_type: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    doc_type_company_certificate_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_type: {_eq: "Company Certificate"}}) {
			      aggregate {
			        count
			      }
			    }
			    doc_type_company_insurance_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_type: {_eq: "Company Insurance"}}) {
			      aggregate {
			        count
			      }
			    }
			    doc_type_company_registration_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_type: {_eq: "Company Registration"}}) {
			      aggregate {
			        count
			      }
			    }
			    doc_type_company_regulatory_body_list_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_type: {_eq: "Company Regulatory Body"}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    
			    list_no_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_version_list: {expiry: {_is_null: true}}}) {
			      aggregate {
			        count
			      }
			    }
			    list_expired_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_version_list: {expiry: {_lte: "now()"}}}) {
			      aggregate {
			        count
			      }
			    }
			    list_mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_version_list: {expiry: {_gt: "now()", _lte: $mon}}}) {
			      aggregate {
			        count
			      }
			    }
			    list_2mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_version_list: {expiry: {_gt: $mon, _lte: $mon2}}}) {
			      aggregate {
			        count
			      }
			    }
			    list_3mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_version_list: {expiry: {_gt: $mon2, _lte: $mon3}}}) {
			      aggregate {
			        count
			      }
			    }
			    list_4mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, doc_version_list: {expiry: {_gt: $mon3}}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    
			    ${dateRangeQueries}
			  }
      }
    `,
		operationName: "findByIdOrgDocumentsDashboardQuery",
	});
}
//</editor-fold>
