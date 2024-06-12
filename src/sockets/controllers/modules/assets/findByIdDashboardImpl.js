//<editor-fold desc="dashboard">
module.exports = async (socket, data) => {
	if (!data) return;
	
	const {written_off = false, now, range_start, range_end,} = data;
	const {site_id, project_id, client_id, company_id, contractor_id, contractor_site_id,} = data;
	const id = site_id || project_id || client_id || company_id;
	let tbl, org_key;
	if (site_id) {
		org_key = "site_id";
		tbl = "default_sites";
	} else if (project_id) {
		org_key = "project_id";
		tbl = "default_projects";
	} else if (client_id) {
		org_key = "client_id";
		tbl = "default_clients";
	} else {
		org_key = "company_id";
		tbl = "default_companies";
	}
	
	const monStart = range_start || now.addMonths(-12);
	const monEnd = range_end || now;
	
	const datesOnlyPrev = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	
	const monStartNext = range_start || now.addMonths(-3);
	const monEndNext = range_end || now.addMonths(8);
	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStartNext, monEndNext);
	
	const dateRangeOnlyPrevQueries = datesOnlyPrev.map(async date => {
		const {year, month, start, end} = date;
		return getGraphQLOne({
			query: `
				query findByIdOrgAssetDashboardQuery_dateRangeOnlyPrev_${year}_${month} {
	        ${tbl}(
	          where: {
	            id: {_eq: ${id}}
	          }
	        ) {
						_${year}_${month}__prev_service_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {plan_list: {service_date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__prev_calibration_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, calibration_record_list: {calibration_list: {calibration_date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__prev_monitoring_plan_fuel_usage_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, monitoring_plan_list: {fuel_usage_list: {date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__prev_monitoring_plan_working_distance_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, monitoring_plan_list: {working_distance_or_time_list: {date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__prev_monitoring_plan_working_time_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, monitoring_plan_list: {working_distance_or_time_list: {date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
				  }
	      }
	    `,
			operationName: `findByIdOrgAssetDashboardQuery_dateRangeOnlyPrev_${year}_${month}`,
		}).then(res => [res]);
	});
	
	const dateRangeQueries = dates.map(async date => {
		const {year, month, start, end} = date;
		return getGraphQLOne({
			multi_queries: true,
			query: `
				query findByIdOrgAssetDashboardQuery_dateRange_${year}_${month} {
					_${year}_${month}__next_calibration_list_aggregate: asset_calibration_record_aggregate(where: {
						asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}},
						next_calibration_date: {_gte: "${start}", _lte: "${end}"}
					}) {
						aggregate {
							count
						}
					}
					_${year}_${month}__doc_expiry_list_aggregate: asset_docs_aggregate(where: {
						removed: {_eq: false},
						asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}},
						expiry: {_gte: "${start}", _lte: "${end}"},
					}) {
						aggregate {
							count
						}
					}
				}
	    	`,
			operationName: `findByIdOrgAssetDashboardQuery_dateRange_${year}_${month}`,
		}).then(res => res && [res]);
	});
	
	const mon = Dates.formatDateSQL(now.addMonths(1));
	const mon2 = Dates.formatDateSQL(now.addMonths(2));
	const mon3 = Dates.formatDateSQL(now.addMonths(3));
	
	return Promise.all([
		getGraphQLOne({
			query: `
                  query findByIdOrgAssetDashboard1Query {
                    ${tbl}(
                      where: {
                        id: {_eq: ${id}}
                      }
                    ) {
                        #
                        all_asset_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}}) {
                          aggregate {
                            count
                          }
                        }
                        removed_asset_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: true}}) {
                          aggregate {
                            count
                          }
                        }
                        condition_new_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "New"}}}) {
                          aggregate {
                            count
                          }
                        }
                        condition_good_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "Good"}}}) {
                          aggregate {
                            count
                          }
                        }
                        condition_fair_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "Fair"}}}) {
                          aggregate {
                            count
                          }
                        }
                        condition_poor_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "Poor"}}}) {
                          aggregate {
                            count
                          }
                        }
                        condition_scrap_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "Scrap"}}}) {
                          aggregate {
                            count
                          }
                        }
                        condition_non_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_is_null: true}}}) {
                          aggregate {
                            count
                          }
                        }
                        
                        #
                        status_in_storage_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_eq: "In Storage"}}) {
                          aggregate {
                            count
                          }
                        }
                        status_checked_out_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_eq: "Checked Out"}}) {
                          aggregate {
                            count
                          }
                        }
                        status_loaned_out_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_eq: "Loaned Out"}}) {
                          aggregate {
                            count
                          }
                        }
                        status_out_for_repair_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_eq: "Out For Repair"}}) {
                          aggregate {
                            count
                          }
                        }
                        status_non_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_is_null: true}}) {
                          aggregate {
                            count
                          }
                        }
                        
                        #
                        maintenance_plan_cost_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_cost: {_is_null: false}}) {
                            nodes{
                              maintenance_plan_cost
                            }
                        }
                    }
                  }
                `,
			operationName: "findByIdOrgAssetDashboard1Query",
		}).then(res => [res]),
		getGraphQLOne({
			multi_queries: true,
			query: `
                    query findByIdOrgAssetDashboard2Query {
                        #
                        next_service_reason_for_service_due_date_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, plan_list: {reason_for_service: {_eq: "Due Date"}}}) {
                          aggregate {
                            count
                          }
                        }
                        next_service_reason_for_service_mechanical_failure_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, plan_list: {reason_for_service: {_eq: "Mechanical Failure"}}}) {
                          aggregate {
                            count
                          }
                        }
                        next_service_reason_for_service_wear_and_tear_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, plan_list: {reason_for_service: {_eq: "Wear And Tear"}}}) {
                          aggregate {
                            count
                          }
                        }
                        next_service_reason_for_service_non_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, plan_list: {reason_for_service: {_is_null: true}}}) {
                          aggregate {
                            count
                          }
                        }
            
                        #
                        next_service_non_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, next_service_hrs_or_km: {_is_null: true}}) {
                          aggregate {
                            count
                          }
                        }
                        next_service_expired_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, is_expired_service_hrs_or_km: {_eq: true}}) {
                         aggregate {
                           count
                         }
                        }
                        next_service_expired_25_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, percentage_left_service_hrs_or_km: {_gt: 0, _lte: 25}}) {
                         aggregate {
                           count
                         }
                        }
                        next_service_expired_50_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, percentage_left_service_hrs_or_km: {_gt: 25, _lte: 50}}) {
                         aggregate {
                           count
                         }
                        }
                        next_service_expired_75_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, percentage_left_service_hrs_or_km: {_gt: 50, _lte: 75}}) {
                         aggregate {
                           count
                         }
                        }
                        next_service_expired_100_list_aggregate: asset_maintenance_plan_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, percentage_left_service_hrs_or_km: {_gt: 75, _lte: 100}}) {
                         aggregate {
                           count
                         }
                        }
                  
                        #
                        next_calibration_date_non_list_aggregate: asset_calibration_record_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, next_calibration_date: {_is_null: true}}) {
                          aggregate {
                            count
                          }
                        }
                        next_calibration_expired_list_aggregate: asset_calibration_record_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, next_calibration_date: {_lte: "now()"}}) {
                          aggregate {
                            count
                          }
                        }
                        next_calibration_mon_expiry_list_aggregate: asset_calibration_record_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, next_calibration_date: {_gt: "now()", _lte: "${mon}"}}) {
                          aggregate {
                            count
                          }
                        }
                        next_calibration_2mon_expiry_list_aggregate: asset_calibration_record_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, next_calibration_date: {_gt: "${mon}", _lte: "${mon2}"}}) {
                          aggregate {
                            count
                          }
                        }
                        next_calibration_3mon_expiry_list_aggregate: asset_calibration_record_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, next_calibration_date: {_gt: "${mon2}", _lte: "${mon3}"}}) {
                          aggregate {
                            count
                          }
                        }
                        next_calibration_4mon_expiry_list_aggregate: asset_calibration_record_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, next_calibration_date: {_gt: "${mon3}"}}) {
                          aggregate {
                            count
                          }
                        }
                        
                        #
                        all_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}}) {
                          aggregate {
                            count
                          }
                        }
                        doc_non_expiry_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, expiry: {_is_null: true}}) {
                          aggregate {
                            count
                          }
                        }
                        doc_expired_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, expiry: {_lte: "now()"}}) {
                          aggregate {
                            count
                          }
                        }
                        doc_mon_expiry_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, expiry: {_gt: "now()", _lte: "${mon}"}}) {
                          aggregate {
                            count
                          }
                        }
                        doc_2mon_expiry_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, expiry: {_gt: "${mon}", _lte: "${mon2}"}}) {
                          aggregate {
                            count
                          }
                        }
                        doc_3mon_expiry_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, expiry: {_gt: "${mon2}", _lte: "${mon3}"}}) {
                          aggregate {
                            count
                          }
                        }
                        doc_4mon_expiry_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, expiry: {_gt: "${mon3}"}}) {
                          aggregate {
                            count
                          }
                        }
                        
                        #
                        type_Bill_of_Sale_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Bill of Sale"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Brake_Test_Report_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Brake Test Report"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Certificate_of_Fitness_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Certificate of Fitness (C.O.F)"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Clearance_Certificate_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Clearance Certificate"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Inspection_Reports_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Inspection Reports"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Insurance_Certificate_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Insurance Certificate"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Invoice_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Invoice"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_LUX_Test_Report_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "LUX Test Report"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Maintenance_Records_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Maintenance Records"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Work_Manual_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Work Manual"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Work_Procedure_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Work Procedure"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Owners_Manual_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Owner\`s Manual"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Vehicle_History_Report_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Vehicle History Report"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Vehicle_License_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Vehicle License"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Vehicle_Registration_Certificate_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Vehicle Registration Certificate"}}) {
                          aggregate {
                            count
                          }
                        }
                        type_Vehicle_Title_doc_list_aggregate: asset_docs_aggregate(where: {asset:{written_off: {_eq: false}, ${org_key}: {_eq: ${id}}}, removed: {_eq: false}, type: {_eq: "Vehicle Title"}}) {
                          aggregate {
                            count
                          }
                        }
			        }
    	        `,
			operationName: "findByIdOrgAssetDashboard2Query",
		}).then(res => res && [res]),
		...dateRangeOnlyPrevQueries,
		...dateRangeQueries,
		// ]).then(res => console.log(res));
	]).then(res => res.
	reduce((a1, a2) => [...a1, ...a2], []).
	reduce((o, a) => ({...o, ...a}), {})
	);
}
//</editor-fold>
