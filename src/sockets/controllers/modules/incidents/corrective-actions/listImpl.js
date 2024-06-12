const {orgs_fragment, employee_personal_details_fragment} = require("../../../../../graphql/Fragments");
const {
	incident_investigation_cause_analysis_immediate_fragment,
	incident_investigation_cause_analysis_root_fragment,
} = require('../investigations/commons');
const {
	getVariablesAndQueryConfig,
} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	// console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		//
		id,
		//
		view = 'Incident Investigation',
		// status,
		//
		logged_employee_id,
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
		id,
		//
		view,
		// status,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	
	if (view === 'Incident Investigation') {
		//<editor-fold desc="ByGroup">
		return listGraphQL({
			query: `
				query listAllByGroupCorrectiveActionsByLoggedQuery {
                sheq_incident_investigation(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter},
                    _and:{
                      _or:[
	                      {investigation:{cause_analysis:{immediate_analysis:{cause_analysis_cause_list:{corrective_action_list:{id:{_is_null: false}}}}}}},
	                      {investigation:{cause_analysis:{root_analysis:{cause_analysis_cause_list:{corrective_action_list:{id:{_is_null: false}}}}}}}
                      ]
                    }
                  },
					        order_by: {incident_date: desc},
					        #order_by: {short_desc: asc, group: asc, incident_time: desc, incident_date: desc},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    id
                    group
                    incident_date
                    short_desc
                    location
                    exact_location
                    #
                    category_list{
                        category{
                          id
                          name
                        }
                    }
                    sub_category_list{
                        sub_category{
                          id
                          name
                          category{
                            id
                            name
                          }
                        }
                    }
                    sector_list{
                        id
                        sector{
                          id
                          name
                        }
                    }
                    activity_list{
                        id
                        activity{
                          id
                          name
                          sector{
                            id
                            name
                          }
                        }
                    }
                    investigation{
                      id
                      cause_analysis{
                        id
                        immediate_analysis{
                          ${incident_investigation_cause_analysis_immediate_fragment}
                        }
                        root_analysis{
                          ${incident_investigation_cause_analysis_root_fragment}
                        }
                      }
                    }
                    ${orgs_fragment}
                }
            }
			`,
			operationName: "listAllByGroupCorrectiveActionsByLoggedQuery",
		});
		// return listGraphQL({
		// 	query: `
    //             query listAllByGroup${singularQueryName}ByLoggedQuery {
    //               hr_employees(
    //                   where: {
    //                       ${listName}_aggregate: {
    //                         count: {
    //                           predicate: {_gt: 0},
    //                           filter: {
    //                             removed: {_eq: ${removed}}
    //                             ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
    //                             ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
    //                             ${filter}
    //                           }
    //                         }
    //                       },
    //                       ${listName}: {
    //                         removed: {_eq: ${removed}}
    //                         ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
    //                         ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
    //                         ${filter}
    //                       }
    //                       ${filterEmployee}
    //                   },
    //                   order_by: {lname: asc},
    //                   offset: ${offset},
    //                   ${limit > 0 ? `limit: ${limit}` : ''}
    //               ) {
    //                   ${employee_personal_details_fragment}
    //                   ${isContract ? `
    //                       ${listName}(where: {removed: {_eq: ${removed}}}, order_by: {contract_details_aggregate: {max: {expiry_date: desc_nulls_last}}}){
    //                           ${inc_fragment({removed})}
    //                       }
    //                       ${listName}_no_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, contract_details: {expiry_date: {_is_null: true}}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listName}_expired_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, contract_details: {expiry_date: {_lte: "now()"}}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listName}_mon_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "now()", _lte: "${mon}"}}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listName}_2mon_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "${mon}", _lte: "${mon2}"}}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listName}_3mon_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listName}_4mon_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "${mon3}"}}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                   ` : `
    //                       ${listRename ? `${listRename}:` : ``}${listName}(
    //                         where: {
    //                             removed: {_eq: ${removed}}
    //                             ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
    //                             ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
    //                         },
    //                         order_by: {expiry_date: desc_nulls_last}
    //                       ){
    //                           ${inc_fragment({removed})}
    //                       }
    //                       ${listRename || listName}_no_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, expiry_date: {_is_null: true}
    //                           ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
    //                           ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listRename || listName}_expired_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, expiry_date: {_lte: "now()"}
    //                           ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
    //                           ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listRename || listName}_mon_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, expiry_date: {_gt: "now()", _lte: "${mon}"}
    //                           ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
    //                           ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listRename || listName}_2mon_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
    //                           ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
    //                           ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listRename || listName}_3mon_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
    //                           ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
    //                           ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                       ${listRename || listName}_4mon_expiry_aggregate:${listName}_aggregate(where: {
    //                           removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon3}"}
    //                           ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
    //                           ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
    //                       }){
    //                           aggregate{
    //                               count
    //                           }
    //                       }
    //                   `}
    //
    //                   ${orgs_fragment}
    //               }
    //             }
		// 	`,
		// 	operationName: `listAllByGroup${singularQueryName}ByLoggedQuery`,
		// });
		//</editor-fold>
	} else {
		//<editor-fold desc="ByEach">
		return listGraphQL({
			query: `
				query listAllByEachCorrectiveActionsByLoggedQuery {
                sheq_incident_investigation_corrective_actions_factors(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter},
                    investigation:{cause_analysis:{immediate_analysis:{cause_analysis_cause_list:{corrective_action_list:{id:{_is_null: false}}}}}}
                  },
	                order_by: {incident_date: desc, incident_time: desc, group: asc, short_desc: asc},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    id
                    group
                    incident_date
                    short_desc
                    location
                    exact_location
                    #
                    category_list{
                        category{
                          id
                          name
                        }
                    }
                    sub_category_list{
                        sub_category{
                          id
                          name
                          category{
                            id
                            name
                          }
                        }
                    }
                    sector_list{
                        id
                        sector{
                          id
                          name
                        }
                    }
                    activity_list{
                        id
                        activity{
                          id
                          name
                          sector{
                            id
                            name
                          }
                        }
                    }
                    investigation{
                      id
                      cause_analysis{
                        id
                        immediate_analysis{
                          ${incident_investigation_cause_analysis_immediate_fragment}
                        }
                        root_analysis{
                          ${incident_investigation_cause_analysis_root_fragment}
                        }
                      }
                    }
                    ${orgs_fragment}
                }
            }
			`,
			operationName: "listAllByEachCorrectiveActionsByLoggedQuery",
		});
		// return listGraphQL({
		// 	query: `
    //             query listAllByEach${singularQueryName}ByLoggedQuery {
    //               ${tbl}(
    //                   where: {
    //                      removed: {_eq: ${removed}},
    //                      ${singular === 'PrDP' ? `type: {_eq: "PrDP"}` : ``}
    //                      ${singular === 'ID/Passport' ? `type: {_eq: "ID/Passport"}` : ``}
    //                      ${filter}
    //                      ${filterEmployee}
    //                   },
    //                   order_by: {employee: {lname: asc}},
    //                   offset: ${offset},
    //                   ${limit > 0 ? `limit: ${limit}` : ''}
    //               ) {
    //                   ${inc_fragment({removed, inc_employee: true})}
    //                   ${(singular === 'PrDP' || singular === 'ID/Passport') ? '' : orgs_fragment}
    //               }
    //             }
		// 	`,
		// 	operationName: `listAllByEach${singularQueryName}ByLoggedQuery`,
		// });
		//</editor-fold>
	}
	
}
//</editor-fold>
