const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require("../../listByLoggedImpl");
const {orgs_fragment, asset_basic_details_fragment} = require("../../../../../graphql/Fragments");
const createImpl = require("../../createImpl");
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
    name: "AssetMonitoringPlan",
    tbl: "asset_monitoring_plan",
    details_fragment: `
	  id
      removed
      next_service_hrs_or_km
      asset_id
      asset{
        id
        ${orgs_fragment}
      }
      fuel_usage_list {
		id
		monitoring_plan_id
		refilled_fuel
		current_hrs_or_km
		working_hrs_or_km
		date
		receipt
		cost
      }
    `,
    orgs_fragment: null,
};

const path = 'assets/monitoring-plans';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    name: 'AssetMonitoringPlans',
    tbl: data => {
        const {
            view = 'Asset',
        } = data;
        console.log('view------------', view)
        return `assets`;
    },
    where: ({data, filters}) => {
        const {
            view = 'Asset',
            written_off: removed = false,
        } = data;

        const {filter, filterAsset} = filters;

        if (view === 'Asset') {
            return `
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
            `;
        }
        if (view === 'Fuel Usage') {
            return `
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
            `;
        }
        if (view === 'Working Time/Distance') {
            return `
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

                total_fuel_usage_per_day
                total_working_hrskm_per_day
                total_fuel_usage_per_hrskm
                
                total_fuel_usage_per_hrskm_per_day
                total_fuel_usage_per_hrskm_per_week
                total_fuel_usage_per_hrskm_per_month
                total_fuel_usage_per_hrskm_per_year
        
                ${orgs_fragment}
            `;
        }
        if (view === 'Fuel Usage') {
            return `
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
            `;
        }
        if (view === 'Working Time/Distance') {
            return `
                ${asset_basic_details_fragment}

                total_working_hrskm
        
                total_working_hrskm_per_day
                total_working_hrskm_per_week
                total_working_hrskm_per_month
                total_working_hrskm_per_year
        
                ${orgs_fragment}
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
        if (view === 'Fuel Usage') {
            return "order_by: {asset_detail:{name: asc}}";
        }
        if (view === 'Working Time/Distance') {
            return "order_by: {asset_detail:{name: asc}}";
        }
    },
    getVariablesAndQueryConfig,
}));
