//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	if (!data) return;
	console.log(data);
	
	const {removed = false, now, range_start, range_end,} = data;
	const {site_id, project_id, client_id, company_id, contractor_id, contractor_site_id, isContractor} = data;
	
	// const id = site_id || project_id || client_id || company_id;
	// let tbl;
	// if (site_id) {
	// 	tbl = "default_sites";
	// } else if (project_id) {
	// 	tbl = "default_projects";
	// } else if (client_id) {
	// 	tbl = "default_clients";
	// } else {
	// 	tbl = "default_companies";
	// }
	//
	// let where = 'is_template: {_eq: false}, group: {_eq: "Contractors"},';
	let where = 'removed: {_eq: false}, is_template: {_eq: false}, group: {_eq: "Contractors"},';
	let whereSite = '';
	
	if (contractor_site_id) {
		where += whereSite += `site:{id: {_eq: ${contractor_site_id}}}`;
	}
	
	if (!isContractor) {
		const id = site_id || project_id || client_id || company_id;
		// if (site_id) {
		// 	where = whereSite = `site:{id: {_eq: ${id}}}`;
		// } else if (project_id) {
		// 	where = `project:{id: {_eq: ${id}}}`;
		// 	whereSite = `site:{project:{id: {_eq: ${id}}}}`;
		// } else if (client_id) {
		// 	where = `client:{id: {_eq: ${id}}}`;
		// 	whereSite = `site:{project:{client:{id: {_eq: ${id}}}}}`;
		// } else {
		// 	where = `company:{id: {_eq: ${id}}}`;
		// 	whereSite = `site:{project:{client:{company:{id: {_eq: ${id}}}}}}`;
		// }
	}
	
	const monStart = range_start || now.addMonths(-12);
	const monEnd = range_end || now.addMonths(6);
	
	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	const dateRangeQueries = dates.map(date => {
		const {year, month, start, end} = date;
		return `
			_${year}_${month}__expiry_document_list_aggregate: default_contractor_questionnaires_ques_aggregate(
				where: {
					questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}},
					questionType: {_eq: "Document"},
					expiry: {_gte: "${start}", _lte: "${end}"}
				}
			) {
				aggregate {
				  count
				}
			}
		`;
	}).join('\n');
	
	const mon = Dates.formatDateSQL(now.addMonths(1));
	const mon2 = Dates.formatDateSQL(now.addMonths(2));
	const mon3 = Dates.formatDateSQL(now.addMonths(3));
	
	return getGraphQLOne({
		multi_queries: true,
		variables: {mon, mon2, mon3},
		query: `
      query findByIdOrgContractorsSingleDashboardQuery($mon: date, $mon2: date, $mon3: date) {
        #
        all_site_list_aggregate: default_sites_aggregate(where: {removed: {_eq: false}, contractor_list: {status:{_neq:"Removed"}, contractor_id:{_eq: ${contractor_id}},${whereSite}}}) {
			    aggregate {
			      count
			    }
			  }
			  all_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  all_documents_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, questionType: {_eq: "Document"}}) {
			    aggregate {
			      count
			    }
			  }
			  all_expired_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gte: "now()"}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  list_no_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_is_null: true}}) {
			    aggregate {
			      count
			    }
			  }
			  list_mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gt: "now()", _lte: $mon}}) {
			    aggregate {
			      count
			    }
			  }
			  list_2mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gt: $mon, _lte: $mon2}}) {
			    aggregate {
			      count
			    }
			  }
			  list_3mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gt: $mon2, _lte: $mon3}}) {
			    aggregate {
			      count
			    }
			  }
			  list_4mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gt: $mon3}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  active_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_neq: "CompleteAccepted"}, contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  completed_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_eq: "CompleteAccepted"}, contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  completion_requests_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_eq: "CompleteRequested"}, contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  declined_requests_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_eq: "CompleteDeclined"}, contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  contractor_questionnaires_compliance_aggregate: default_contractor_questionnaires_aggregate(where: {contractor_id:{_eq: ${contractor_id}},${where}}) {
			    nodes{
			      compliance
			    }
			  }
			  
			  #
			  ${dateRangeQueries}
      }
    `,
		operationName: "findByIdOrgContractorsSingleDashboardQuery",
	}).then(res => [res]);
}
//</editor-fold>
