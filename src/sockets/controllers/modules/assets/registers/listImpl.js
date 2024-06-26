const {orgs_fragment, asset_basic_details_fragment} = require("../../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="maintenance_plan_inc_fragment">
const maintenance_plan_inc_fragment = `
  id
  removed
  next_service_hrs_or_km
  max_next_schedule_service_hrs_or_km
  prev_maintenance_plan_id
  prev_maintenance_plan{
    id
  }
  asset{
    id
    ${orgs_fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		view = 'Asset',
		mon, mon2, mon3,
		expiry_date = 'ALL',
		date_range,
		written_off = false,
		written_off: removed = false,
		//
		asset_id,
		responsible_person_list,
		//
		name,
		reg_num,
		serial_num,
		model,
		condition,
		location,
		manufacturer,
		asset_type,
		status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter, filterAsset} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		view,
		mon, mon2, mon3,
		expiry_date,
		date_range,
		//
		asset_id,
		responsible_person_list,
		//
		name,
		reg_num,
		serial_num,
		model,
		condition,
		location,
		manufacturer,
		asset_type,
		status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (view === 'Asset') {
		return viewByAsset({removed, filter, filterAsset, offset, limit, mon, mon2, mon3});
	} else if(view === 'Upcoming Maintenances') {
		return viewUpcomingMaintenances({removed, filter, filterAsset, offset, limit, mon, mon2, mon3});
  } else if(view === 'Past Maintenances') {
		return viewPastMaintenances({removed, filter, filterAsset, offset, limit, mon, mon2, mon3});
  } else if(view === 'Maintenance History') {
		return viewMaintenanceHistory({removed, filter, filterAsset, offset, limit, mon, mon2, mon3});
  }
}
//</editor-fold>

function viewByAsset({removed, filter, filterAsset, offset, limit, mon, mon2, mon3}) {
  return listGraphQL({
    query: `
      query listAllByGroupAssetMaintenanceByLoggedQuery {
        assets(
          where: {
            maintenance_plan_list_aggregate: {
              count: {
                predicate: {_gt: 0},
                filter: {removed: {_eq: ${removed}}${filter}}
              }
            },
            ${filterAsset}
          }
          order_by: {asset_detail:{name: asc}},
          offset: ${offset},
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${asset_basic_details_fragment}

          maintenance_last_completed_date

          upcoming_maintenance_list:maintenance_plan_list(
            where: {
              removed: {_eq: false}, 
              is_expired_service_hrs_or_km:{_eq: false},
            }, 
            order_by: {left_service_hrs_or_km: desc_nulls_last}
          ){
            ${maintenance_plan_inc_fragment}
          }
          last_maintenance_list:maintenance_plan_list(
            where: {removed: {_eq: false}, is_expired_service_hrs_or_km: {_eq: true}},
            order_by: {left_service_hrs_or_km: desc_nulls_last},
            limit: 1
          ){
            ${maintenance_plan_inc_fragment}
          }

          past_maintenance_list_aggregate:maintenance_plan_list_aggregate(
            where: {removed: {_eq: false}, is_expired_service_hrs_or_km: {_eq: true}}
          ){
            aggregate{
              count
            }
          }
          past_completed_before_maintenance_list_aggregate:maintenance_plan_list_aggregate(
            where: {
              removed: {_eq: false}, 
              is_completed_before: {_eq: true}
            }
          ){
            aggregate{
              count
            }
          }
          past_completed_after_maintenance_list_aggregate:maintenance_plan_list_aggregate(
            where: {
              removed: {_eq: false}, 
              is_completed_after: {_eq: true}
            }
          ){
            aggregate{
              count
            }
          }

          ${orgs_fragment}
        }
      }
    `,
  });
}

function viewUpcomingMaintenances({removed, filter, filterAsset, offset, limit, mon, mon2, mon3}) {
  return listGraphQL({
    query: `
      query listAllUpcomingMaintenancesByLoggedQuery {
        asset_maintenance_plan(
          where: {
            removed: {_eq: ${removed}},
            is_expired_service_hrs_or_km:{_eq: false},
            ${filter},
            ${filterAsset}
          },
          order_by: {left_service_hrs_or_km: asc},
          offset: ${offset},
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          id
          removed
          next_service_hrs_or_km
          max_next_schedule_service_hrs_or_km
          prev_maintenance_plan_id
          prev_maintenance_plan{
            id
          }
          
          asset{
            ${asset_basic_details_fragment}
            maintenance_plan_list(where: {removed: {_eq: false}}){
              id
              next_service_hrs_or_km
              max_next_schedule_service_hrs_or_km
              prev_maintenance_plan_id
              prev_maintenance_plan{
                id
              }
            }
            ${orgs_fragment}
          }
        }
      }
    `,
  });
}

function viewPastMaintenances({removed, filter, filterAsset, offset, limit, mon, mon2, mon3}) {
  return listGraphQL({
    query: `
      query listAllPastMaintenancesByLoggedQuery {
        asset_maintenance_plan(
          where: {
            removed: {_eq: ${removed}},
            is_expired_service_hrs_or_km: {_eq: true},
            ${filter},
            ${filterAsset}
          },
          order_by: {left_service_hrs_or_km: asc},
          offset: ${offset},
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          id
          removed
          next_service_hrs_or_km
          max_next_schedule_service_hrs_or_km
          prev_maintenance_plan_id
          prev_maintenance_plan{
            id
          }

          completed_date #last date was maintained
          completed_hrs_or_km #last hrs/km was maintained
          completed_hrs_or_km_count #last hrs/km difference from next hrs/km maintainence, next hrs/km - last maintainence hrs/km [60k - 61k = -1k]
          
          curr_monitoring_hrs_or_km #current hrs/km

          is_completed #monitoring for the schedule is fulfilled
          is_completed_before #monitoring for the schedule is fulfilled before
          is_completed_after #monitoring for the schedule is fulfilled after
          
          is_expired_service_hrs_or_km #left hrs/km is <= 0
          left_service_hrs_or_km #total - taken hrs/km

          maintenance_plan_cost

          percentage_curr_service_hrs_or_km #taken / total hrs/km * 100
          percentage_left_service_hrs_or_km #100 - curr percentage
          taken_service_hrs_or_km #current - begining of hrs/km
          total_service_hrs_or_km #max next schedule service - begining of hrs/km

          plan_list(where: {removed: {_eq: false}}, order_by: {service_date: desc}){
            id
            removed
            reason_for_service
            service
            service_hrs_or_km
            service_date
            cost
            receipt
          }
          
          asset{
            ${asset_basic_details_fragment}
            maintenance_plan_list(where: {removed: {_eq: false}}){
              id
              next_service_hrs_or_km
              max_next_schedule_service_hrs_or_km
              prev_maintenance_plan_id
              prev_maintenance_plan{
                id
              }
            }
            ${orgs_fragment}
          }
        }
      }
    `,
  });
}

function viewMaintenanceHistory({removed, filter, filterAsset, offset, limit, mon, mon2, mon3}) {
  return listGraphQL({
    query: `
      query listAllMaintenanceHistoryByLoggedQuery {
        asset_maintenance_plan_list(
          where: {
            removed: {_eq: ${removed}},
            ${filter},
            ${filterAsset}
          },
          order_by: {service_date: desc},
          offset: ${offset},
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          id
          removed
          reason_for_service
          service
          service_hrs_or_km
          service_date
          cost
          receipt

          scheduled_hrs_or_km
          is_completed_after
          is_completed_before
          completed_hrs_or_km_count

          maintenance_plan_id
          maintenance_plan{
            next_service_hrs_or_km
            max_next_schedule_service_hrs_or_km
            prev_maintenance_plan_id
            prev_maintenance_plan{
              id
            }
            
            asset{
              ${asset_basic_details_fragment}
              maintenance_plan_list(where: {removed: {_eq: ${removed}}}){
                id
                next_service_hrs_or_km
                max_next_schedule_service_hrs_or_km
                prev_maintenance_plan_id
                prev_maintenance_plan{
                  id
                }
              }
              ${orgs_fragment}
            }
          }
        }
      }
    `,
  });
}