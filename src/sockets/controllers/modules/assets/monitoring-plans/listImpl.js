const { orgs_fragment, asset_basic_details_fragment } = require("../../../../../graphql/Fragments");
const { getVariablesAndQueryConfig } = require('./commons');

//<editor-fold desc="monitoring_plan_inc_fragment">
const monitoring_plan_inc_fragment = `
  id
  removed
  fuel_usage_list{
    id
    refilled_fuel
    current_hrs_or_km
    working_hrs_or_km
    date
    receipt
    cost
  }
  working_distance_or_time_list{
    id
    working_hrs_or_km_opening
    working_hrs_or_km_closing
    date

    working_hrs_or_km
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

  const { filter, filterAsset } = getVariablesAndQueryConfig({
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
    return viewByAsset({ removed, filter, filterAsset, offset, limit, mon, mon2, mon3 });
  } else if (view === 'Fluel Usage') {
    return viewFuelUsage({ removed, filter, filterAsset, offset, limit, mon, mon2, mon3 });
  } else if (view === 'Working Time/Distance') {
    return viewWorkingTimeOrDistance({ removed, filter, filterAsset, offset, limit, mon, mon2, mon3 });
  }
}
//</editor-fold>

function viewByAsset({ removed, filter, filterAsset, offset, limit, mon, mon2, mon3 }) {
  return listGraphQL({
    query: `
      query listAllByGroupAssetMaintenanceByLoggedQuery {
        assets(
          where: {
            monitoring_plan_list_aggregate: {
              count: {
                predicate: {_gt: 0},
                filter: {removed: {_eq: ${removed}}${filter}}
              }
            },
            monitoring_plan_list: {removed: {_eq: ${removed}}${filter}},
            total_fuel_usage_days: {_gt: 0},
            total_working_hrskm_days: {_gt: 0},
            
            ${filterAsset}
          }
          order_by: {asset_detail:{name: asc}},
          offset: ${offset},
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${asset_basic_details_fragment}

          total_fuel_usage_per_day
          total_working_hrskm_per_day
          total_fuel_usage_per_hrskm
          
          total_fuel_usage_per_hrskm_per_day
          total_fuel_usage_per_hrskm_per_week
          total_fuel_usage_per_hrskm_per_month
          total_fuel_usage_per_hrskm_per_year

          ${orgs_fragment}
        }
      }
    `,
  });
}

function viewFuelUsage({ removed, filter, filterAsset, offset, limit, mon, mon2, mon3 }) {
  return listGraphQL({
    query: `
      query listAllByGroupAssetFluelUsageByLoggedQuery {
        assets(
          where: {
            monitoring_plan_list_aggregate: {
              count: {
                predicate: {_gt: 0}, 
                filter: {
                  removed: {_eq: false}, 
                  fuel_usage_list_aggregate: {count: {predicate: {_gt: 0}}}
                  ${filter}
                }
              }
            }, 
            total_fuel_usage_days: {_gt: 0}
            ${filterAsset}
          }
          order_by: {asset_detail:{name: asc}},
          offset: ${offset},
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${asset_basic_details_fragment}

          last_fuel_usage
          last_fuel_usage_date
          last_fuel_usage_hrs_or_km

          total_fuel_usage

          total_fuel_usage_per_day
          total_fuel_usage_per_week
          total_fuel_usage_per_month
          total_fuel_usage_per_year

          total_fuel_usage_per_hrskm

          ${orgs_fragment}
        }
      }
    `,
  });
}

function viewWorkingTimeOrDistance({ removed, filter, filterAsset, offset, limit, mon, mon2, mon3 }) {
  return listGraphQL({
    query: `
      query listAllByGroupAssetWorkingTimeOrDistanceByLoggedQuery {
        assets(
          where: {
            monitoring_plan_list_aggregate: {
              count: {
                predicate: {_gt: 0}, 
                filter: {
                  removed: {_eq: false}, 
                  working_distance_or_time_list_aggregate:{count: {predicate: {_gt: 0}}}
                  ${filter}
                }
              }
            }, 
            total_working_hrskm_days: {_gt: 0}
            ${filterAsset}
          }
          order_by: {asset_detail:{name: asc}},
          offset: ${offset},
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${asset_basic_details_fragment}

          total_working_hrskm

          total_working_hrskm_per_day
          total_working_hrskm_per_week
          total_working_hrskm_per_month
          total_working_hrskm_per_year

          ${orgs_fragment}
        }
      }
    `,
  });
}
