//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    if(!data) return;

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

    return getGraphQLOne({
        multi_queries: true,
        count: true,
        query: `
            query findByIdOrgQuickIncidentsDashboardQuery {
                ${tbl}(
                  where: {id: {_eq: ${id}},},
                ) {
                    #
                    all_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}}) {
                      aggregate {
                        count
                      }
                    }
                    
                    #
                    time_shift_day_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_eq: "Day"}}) {
                      aggregate {
                        count
                      }
                    } 
                    time_shift_night_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_eq: "Night"}}) {
                      aggregate {
                        count
                      }
                    }
                    time_shift_non_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_is_null: true}}) {
                      aggregate {
                        count
                      }
                    }
                    
                    #
                    is_vehicle_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_eq: true}}) {
                      aggregate {
                        count
                      }
                    } 
                    is_not_vehicle_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_eq: false}}) {
                      aggregate {
                        count
                      }
                    }   
                    is_unclassified_vehicle_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_is_null: true}}) {
                      aggregate {
                        count
                      }
                    }   
                    
                    #
                    person_injured_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, _or: [{person_injured_other_id: {_is_null: false}}, {person_injured_id: {_is_null: false}}]}) {
                      aggregate {
                        count
                      }
                    } 
                    person_injured_non_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, _and: [{person_injured_other_id: {_is_null: true}}, {person_injured_id: {_is_null: true}}]}) {
                      aggregate {
                        count
                      }
                    }
                    
                    #
                    severity_medical_exam_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, severity: {_eq: "Medical Examination"}}) {
                      aggregate {
                        count
                      }
                    } 
                    severity_working_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, severity: {_eq: "Working / At Work"}}) {
                      aggregate {
                        count
                      }
                    } 
                    severity_unclassified_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, severity: {_is_null: true}}) {
                      aggregate {
                        count
                      }
                    } 
                    
                    #
                    distinct_vehicle_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, vehicle_reg_num: {_is_null: false}}) {
                      aggregate {
                        count
                      }
                    } 
                    distinct_driver_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, driver_id: {_is_null: false}}) {
                      aggregate {
                        count
                      }
                    }
                    distinct_person_injured_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, _or: [{person_injured_other_id: {_is_null: false}}, {person_injured_id: {_is_null: false}}]}) {
                      aggregate {
                        count
                      }
                    }
                    distinct_person_reporting_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}, _or: [{person_reporting_other_id: {_is_null: false}}, {person_reporting_id: {_is_null: false}}]}) {
                      aggregate {
                        count
                      }
                    }
                }
            }
        `,
        operationName: "findByIdOrgQuickIncidentsDashboardQuery",
    });
}
//</editor-fold>