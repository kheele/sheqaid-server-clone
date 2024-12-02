const findByIdImpl = require('../../findByIdImpl');
const upsertImpl = require("../../upsertImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");
const deleteImpl = require('../../deleteImpl');
const {orgs_fragment, asset_basic_details_fragment} = require("../../../../../graphql/Fragments");
const createImpl = require("../../createImpl");
const {getVariablesAndQueryConfig} = require("../calibration-records/commons");

const details_fragment = `
  id
  removed
  next_service_hrs_or_km
  plan_list {
    id
    maintenance_plan_id
    reason_for_service
    service
    service_hrs_or_km
    service_date
    cost
    receipt
    parts_used_list{
	  id
      part_id
      plan_list_id
      qty
    }
  }
  asset{
    id
    ${orgs_fragment}
  }
`;

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

const args = {
    name: "AssetMaintenancePlan",
    tbl: "asset_maintenance_plan",
    details_fragment,
    orgs_fragment: null,
};

const path = 'assets/maintenance-plans';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/delete`, deleteImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    name: 'AssetMaintenancePlans',
    tbl: data => {
        const {
            view = 'Asset',
        } = data;
        console.log('view------------', view)
        if (view === 'Asset') {
            return `assets`;
        }
        if (view === 'Upcoming Maintenances' || view === 'Past Maintenances') {
            return `asset_maintenance_plan`;
        }
        if (view === 'Maintenance History') {
            return `asset_maintenance_plan_list`;
        }
    },
    where: ({data, filters}) => {
        const {
            view = 'Asset',
            written_off: removed = false,
        } = data;

        const {filter, filterAsset} = filters;

        if (view === 'Asset') {
            return `
                maintenance_plan_list_aggregate: {
                  count: {
                    predicate: {_gt: 0},
                    filter: {removed: {_eq: ${removed}}${filter}}
                  }
                },
                ${filterAsset}
            `;
        }
        if (view === 'Upcoming Maintenances') {
            return `
                removed: {_eq: ${removed}},
                is_expired_service_hrs_or_km:{_eq: false},
                ${filter},
                asset:{${filterAsset}},
            `;
        }
        if (view === 'Past Maintenances') {
            return `
                removed: {_eq: ${removed}},
                is_expired_service_hrs_or_km: {_eq: true},
                ${filter},
                asset:{${filterAsset}},
            `;
        }
        if (view === 'Maintenance History') {
            return `
                removed: {_eq: ${removed}},
                ${filter},
                maintenance_plan:{asset:{${filterAsset}}},
            `;
        }
    },
    orgs_fragment: null,
    details_fragment: data => {
        const {
            view = 'Asset',
            mon, mon2, mon3,
            written_off: removed = false,
        } = data;
        if (view === 'Asset') {
            return `
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
            `;
        }
        if (view === 'Upcoming Maintenances') {
            return `
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
            `;
        }
        if (view === 'Past Maintenances') {
            return `
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
            `;
        }
        if (view === 'Maintenance History') {
            return `
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
            `;
        }
    },
    order_by: data => {
        const {
            view = 'Asset',
        } = data;
        if (view === 'Asset') {
            return "order_by: {asset_detail:{name: asc}}";
        }
        if (view === 'Upcoming Maintenances') {
            return "order_by: {left_service_hrs_or_km: asc}";
        }
        if (view === 'Past Maintenances') {
            return "order_by: {left_service_hrs_or_km: asc}";
        }
        if (view === 'Maintenance History') {
            return "order_by: {service_date: desc}";
        }
    },
    getVariablesAndQueryConfig,
}));
