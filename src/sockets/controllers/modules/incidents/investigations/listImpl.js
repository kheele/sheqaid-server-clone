const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {incident_investigation_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	// console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		id,
		//
		person_reporting_id,
		person_reported_to_id,
		person_involved_id,
		person_injured_id,
		witness_id,
		person_distributed_to_id,
		driver_id,
		//
		category_list,
		sub_category_list,
		activity_list,
		//
		exact_location,
		is_vehicle_incident,
		vehicle_make,
		vehicle_reg_num,
		incident_status,
		investigation_status,
		//
		group,
		consequence,
		likelihood,
		risk_rating,
		//
		day_group,
		time_shift,
		incident_date_range,
		date_reported_range,
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
		person_reporting_id,
		person_reported_to_id,
		person_involved_id,
		person_injured_id,
		witness_id,
		person_distributed_to_id,
		driver_id,
		//
		category_list,
		sub_category_list,
		activity_list,
		//
		exact_location,
		is_vehicle_incident,
		vehicle_make,
		vehicle_reg_num,
		incident_status,
		investigation_status,
		//
		group,
		consequence,
		likelihood,
		risk_rating,
		//
		day_group,
		time_shift,
		incident_date_range,
		date_reported_range,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	return listGraphQL({
		query: `
			query listAllIncidentInvestigationByLoggedQuery {
                sheq_incident_investigation(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter},
                    investigation_id: {_is_null: false},
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
                        ${incident_investigation_details_fragment}
                    }
                    ${orgs_fragment}
                }
            }
		`,
		operationName: "listAllIncidentInvestigationByLoggedQuery",
	});
}
//</editor-fold>
