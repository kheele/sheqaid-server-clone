//<editor-fold desc="listImpl">

//<editor-fold desc="contractor_questionnaire_question_list_fragment">
const contractor_questionnaire_question_list_fragment = (deep = 3) => {
	if (deep === 0) {
		return `id`;
	}
	return `
    id
    maxScore
    score
    question_list{
        ${contractor_questionnaire_question_list_fragment(deep - 1)}
    }
`;
};
//</editor-fold>

module.exports = async (socket, data) => {
	if (!data) return;
	console.log(data);
	
	const {removed = false, now, range_start, range_end,} = data;
	const {site_id, project_id, client_id, company_id, contractor_id, contractor_site_id, isContractor} = data;
	
	const id = site_id || project_id || client_id || company_id;
	let where = 'removed: {_eq: false}, is_template: {_eq: false}, group: {_eq: "Contractors"},';
	let whereSite = '';
	if (site_id) {
		where += whereSite = `site:{id: {_eq: ${id}}}`;
	} else if (project_id) {
		where += `project:{id: {_eq: ${id}}}`;
		whereSite = `site:{project:{id: {_eq: ${id}}}}`;
	} else if (client_id) {
		where += `client:{id: {_eq: ${id}}}`;
		whereSite = `site:{project:{client:{id: {_eq: ${id}}}}}`;
	} else {
		where += `company:{id: {_eq: ${id}}}`;
		whereSite = `site:{project:{client:{company:{id: {_eq: ${id}}}}}}`;
	}
	
	const monStart = range_start || now.addMonths(-12);
	const monEnd = range_end || now.addMonths(6);
	
	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	const dateRangeQueries = dates.map(date => {
		const {year, month, start, end} = date;
		return `
			_${year}_${month}__expiry_document_list_aggregate: default_contractor_questionnaires_ques_aggregate(
				where: {
					questionnaire: {${where}},
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
      query findByIdOrgContractorsMainDashboardQuery($mon: date, $mon2: date, $mon3: date) {
        #
        all_contractor_list_aggregate: default_contractors_aggregate(where: {site_list: {status:{_neq:"Removed"}, ${whereSite}}}) {
			    aggregate {
			      count
			    }
			  }
			  all_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {${where}}) {
			    aggregate {
			      count
			    }
			  }
			  all_documents_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {${where}}, questionType: {_eq: "Document"}}) {
			    aggregate {
			      count
			    }
			  }
			  all_expired_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {${where}}, expiry: {_gte: "now()"}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  list_no_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {${where}}, expiry: {_is_null: true}}) {
			    aggregate {
			      count
			    }
			  }
			  list_mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {${where}}, expiry: {_gt: "now()", _lte: $mon}}) {
			    aggregate {
			      count
			    }
			  }
			  list_2mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {${where}}, expiry: {_gt: $mon, _lte: $mon2}}) {
			    aggregate {
			      count
			    }
			  }
			  list_3mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {${where}}, expiry: {_gt: $mon2, _lte: $mon3}}) {
			    aggregate {
			      count
			    }
			  }
			  list_4mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {${where}}, expiry: {_gt: $mon3}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  active_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_neq: "CompleteAccepted"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  completed_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_eq: "CompleteAccepted"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  completion_requests_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_eq: "CompleteRequested"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  declined_requests_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_eq: "CompleteDeclined"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  active_questionnaire_list: default_contractor_questionnaires(where: {status: {_neq: "CompleteAccepted"}, ${where}}) {
			    contractor_id
			  }
			  completed_questionnaire_list: default_contractor_questionnaires(where: {status: {_eq: "CompleteAccepted"}, ${where}}) {
			    contractor_id
			    contractor{
			      id
			      name
			    }
			    question_list {
			      ${contractor_questionnaire_question_list_fragment(3)}
			    }
			  }
			  completion_requests_questionnaire_list: default_contractor_questionnaires(where: {status: {_eq: "CompleteRequested"}, ${where}}) {
			    contractor_id
			  }
			  declined_requests_questionnaire_list: default_contractor_questionnaires(where: {status: {_eq: "CompleteDeclined"}, ${where}}) {
			    contractor_id
			  }
			  
			  #
			  ${dateRangeQueries}
      }
    `,
		operationName: "findByIdOrgContractorsMainDashboardQuery",
	}).then(res => [res]);
}
//</editor-fold>
