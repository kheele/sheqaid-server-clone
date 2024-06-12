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
	
	const createWorkplaceViolenceStats = (key, value, year, month, start, end) => {
		return `
			_${year}_${month}__${key}${value.replaceAll(' ', '')}_incident_list_aggregate: incident_list_aggregate(
				where: {
					incident_date: {_gte: "${start}", _lte: "${end}"},
					removed: {_eq: false},
					category_list: {category:{name: {_eq: "Workplace Violence"}}},
					sub_category_list: {sub_category:{name: {_eq: "${value}"}}}
				}
			) {
			    aggregate {
			    	count
			    }
			}
		`;
	};
	
	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	
	const dateRangeQueries = dates.map(async date => {
		const {year, month, start, end} = date;
		return getGraphQLOne({
			query: `
				query findByIdOrgAssetDashboardQuery_dateRange_${year}_${month} {
                    ${tbl}(
                      where: {
                        id: {_eq: ${id}}
                      }
                    ) {
                         _${year}_${month}__all_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}}) {
                        aggregate {
                          count
                        }
                    }
                        _${year}_${month}__person_injured_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, _or: [{person_injured_other_id: {_is_null: false}}, {person_injured_id: {_is_null: false}}]}) {
                            aggregate {
                              count
                            }
                        }
                        _${year}_${month}__group_lti_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, group: {_eq: "Reportable (LTI)"}}) {
                          aggregate {
                              count
                            }
                        }
                        _${year}_${month}__firstaid_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, sub_category_list: {sub_category:{name: {_eq: "First Aid"}}}}) {
                          aggregate {
                            count
                          }
                        }
                        _${year}_${month}__nearmiss_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, sub_category_list: {sub_category:{name: {_eq: "Near miss"}}}}) {
                          aggregate {
                            count
                          }
                        }
                        _${year}_${month}__fatality_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, sub_category_list: {sub_category: {name: {_eq: "Fatality"}}}}) {
                          aggregate {
                              count
                            }
                        }
                        _${year}_${month}__vehicle_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, is_vehicle_incident: {_eq: true}}) {
                          aggregate {
                              count
                            }
                        }
                        ${createWorkplaceViolenceStats('WorkplaceViolence', 'Homicide', year, month, start, end)}
                        ${createWorkplaceViolenceStats('WorkplaceViolence', 'Physical Assault', year, month, start, end)}
                        ${createWorkplaceViolenceStats('WorkplaceViolence', 'Verbal Abuse', year, month, start, end)}
                        ${createWorkplaceViolenceStats('WorkplaceViolence', 'Intimidation', year, month, start, end)}
                        ${createWorkplaceViolenceStats('WorkplaceViolence', 'Threats', year, month, start, end)}
                        ${createWorkplaceViolenceStats('WorkplaceViolence', 'Cyberbullying', year, month, start, end)}
                        ${createWorkplaceViolenceStats('WorkplaceViolence', 'Sexual Harassment', year, month, start, end)}
                        ${createWorkplaceViolenceStats('WorkplaceViolence', 'Discrimination', year, month, start, end)}
                        ${createWorkplaceViolenceStats('WorkplaceViolence', 'Stalking', year, month, start, end)}
                      }
                  }
                `,
			operationName: `findByIdOrgAssetDashboardQuery_dateRange_${year}_${month}`,
		});
	});
	
	return Promise.all([
		getGraphQLOne({
			query: `
      query findByIdOrgIncidentsDashboardQuery {
        ${tbl}(
          where: {
            id: {_eq: ${id}}
          }
        ) {
			    #
			    all_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    all_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    all_investigation_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, investigation_id: {_is_null: false}}) {
			      aggregate {
			        count
			      }
			    }
			    all_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, source: {_eq: "Incident Investigation"}}) {
			      aggregate {
			        count
			      }
			    }
			    # all_corrective_action_list_aggregate: corrective_actions(where: {removed: {_eq: false}, investigation_id: {_is_null: false}}) {
			    #   aggregate {
			    #     count
			    #   }
			    # }
			    
			    #
			    risk_rating_non_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "N/A"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_rating_low_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "Low"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_rating_medium_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "Medium"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_rating_high_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "High"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_rating_extreme_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "Extreme"}}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    status_open_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, status_closed: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    status_closed_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, status_closed: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    }
			    #
			    group_lti_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, group: {_eq: "Reportable (LTI)"}}) {
			      aggregate {
			        count
			      }
			    }
			    group_nlti_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, group: {_eq: "Non-Reportable (NLTI)"}}) {
			      aggregate {
			        count
			      }
			    }
			    firstaid_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, sub_category_list: {sub_category:{name: {_eq: "First Aid"}}}}) {
			      aggregate {
			        count
			      }
			    }
			    nearmiss_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, sub_category_list: {sub_category:{name: {_eq: "Near miss"}}}}) {
			      aggregate {
			        count
			      }
			    }
			    workplaceViolence_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, category_list: {category:{name: {_eq: "Workplace Violence"}}}}) {
			      aggregate {
			        count
			      }
			    }
			    group_non_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, group: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    #
			    vehicle_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    }
			    non_vehicle_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    #
			    person_injured_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, _or: [{person_injured_other_id: {_is_null: false}}, {person_injured_id: {_is_null: false}}]}) {
			      aggregate {
			        count
			      }
			    }
			    non_person_injured_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, _and: [{person_injured_other_id: {_is_null: true}}, {person_injured_id: {_is_null: true}}]}) {
			      aggregate {
			        count
			      }
			    }
			    #
			    time_shift_day_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_eq: "Day"}}) {
			      aggregate {
			        count
			      }
			    }
			    time_shift_night_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_eq: "Night"}}) {
			      aggregate {
			        count
			      }
			    }
			    time_shift_non_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    #
			    incident_time_morning_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, incident_time: {_lt: "12:00"}}) {
			      aggregate {
			        count
			      }
			    }
			    incident_time_afternoon_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, incident_time: {_gte: "12:00"}}) {
			      aggregate {
			        count
			      }
			    }
			    incident_time_non_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, incident_time: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    #
			    fatality_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, sub_category_list: {sub_category: {name: {_eq: "Fatality"}}}}) {
			      aggregate {
			        count
			      }
			    }
			    non_fatality_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, _or: [{sub_category_list_aggregate: {count: {predicate: {_eq: 0}}}}, {sub_category_list: {sub_category: {name: {_neq: "Fatality"}}}}]}) {
			      aggregate {
			        count
			      }
			    }
			  }
		  }
		`,
			operationName: "findByIdOrgIncidentsDashboardQuery",
		}),
		...dateRangeQueries,
	]).then(res => res.reduce((o, a) => ({...o, ...a}), {}));
	
	// return getGraphQLOne({
	// 	multi_queries: true,
	// 	count: true,
	// 	query: `
  //           query findByIdOrgQuickIncidentsDashboardQuery {
  //               ${tbl}(
  //                 where: {id: {_eq: ${id}},},
  //               ) {
  //                   #
  //                   all_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //
  //                   #
  //                   time_shift_day_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_eq: "Day"}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   time_shift_night_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_eq: "Night"}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   time_shift_non_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_is_null: true}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //
  //                   #
  //                   is_vehicle_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_eq: true}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   is_not_vehicle_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_eq: false}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   is_unclassified_vehicle_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_is_null: true}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //
  //                   #
  //                   person_injured_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, _or: [{person_injured_other_id: {_is_null: false}}, {person_injured_id: {_is_null: false}}]}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   person_injured_non_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, _and: [{person_injured_other_id: {_is_null: true}}, {person_injured_id: {_is_null: true}}]}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //
  //                   #
  //                   severity_medical_exam_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, severity: {_eq: "Medical Examination"}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   severity_working_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, severity: {_eq: "Working / At Work"}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   severity_unclassified_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, severity: {_is_null: true}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //
  //                   #
  //                   distinct_vehicle_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, vehicle_reg_num: {_is_null: false}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   distinct_driver_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, driver_id: {_is_null: false}}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   distinct_person_injured_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, _or: [{person_injured_other_id: {_is_null: false}}, {person_injured_id: {_is_null: false}}]}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //                   distinct_person_reporting_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, _or: [{person_reporting_other_id: {_is_null: false}}, {person_reporting_id: {_is_null: false}}]}) {
  //                     aggregate {
  //                       count
  //                     }
  //                   }
  //               }
  //           }
  //       `,
	// 	operationName: "findByIdOrgQuickIncidentsDashboardQuery",
	// });
}
//</editor-fold>
