const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {incident_quick_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		incident_date,
		date_reported,
		time_shift,
		category_list,
		person_reporting_id,
		person_reporting_other_id,
		person_injured_id,
		person_injured_other_id,
		driver_id,
		driver_other_id,
		severity,
		exact_location,
		is_vehicle_incident,
		vehicle_make,
		vehicle_reg_num,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data || {};
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		incident_date,
		date_reported,
		time_shift,
		category_list,
		person_reporting_id,
		person_reporting_other_id,
		person_injured_id,
		person_injured_other_id,
		driver_id,
		driver_other_id,
		severity,
		exact_location,
		is_vehicle_incident,
		vehicle_make,
		vehicle_reg_num,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	return listGraphQL({
		query: `
			  query listAllQuickIncidentsByLoggedQuery {
                sheq_incident_investigation_quick(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
                    order_by: {incident_date: desc},
                    #order_by: {short_desc: asc, incident_time: desc, incident_date: desc},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${incident_quick_details_fragment}
                    ${orgs_fragment}
                }
            }
		`,
		operationName: "listAllQuickIncidentsByLoggedQuery",
	});
}
//</editor-fold>
