const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require('../../listByLoggedImpl');
const {orgs_fragment, asset_basic_details_fragment} = require("../../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require("./commons");
const createImpl = require("../../createImpl");
const upsertImpl = require("../../upsertImpl");
const deleteImpl = require("../../deleteImpl");

//<editor-fold desc="calibration_record_inc_fragment">
const calibration_record_inc_fragment = `
  id
  removed
  next_calibration_interval
  next_calibration_date
  calibration_list {
	id
	calibration_record_id
	calibrating_company
	reference_standard
	certificate_num
	calibration_date
  }
  asset{
    id
    ${orgs_fragment}
  }
`;
//</editor-fold>

const args = {
    name: "AssetCalibrationRecord",
    tbl: "asset_calibration_record",
    details_fragment: calibration_record_inc_fragment,
    orgs_fragment: null,
};

const path = 'assets/calibration-records';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/delete`, deleteImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    name: 'AssetCalibrationRecords',
    tbl: data => {
        const {
            view = 'Asset',
        } = data;
        console.log('view------------', view)
        if (view === 'Asset') {
            return `assets`;
        }
        if (view === 'Upcoming Calibrations' || view === 'Past Calibrations') {
            return `asset_calibration_record`;
        }
        if (view === 'Calibration History') {
            return `asset_calibration_record_list`;
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
                calibration_record_list_aggregate: {
                  count: {
                    predicate: {_gt: 0},
                    filter: {
                      #calibration_list_aggregate: {
                      #  count: {
                      #    predicate: {_gt: 0},
                      #    filter: {
                      #      removed: {_eq: false}
                      #    }
                      #  }
                      #},
                      removed: {_eq: ${removed}}${filter}
                    }
                  }
                },
                calibration_record_list: {removed: {_eq: ${removed}}${filter}},
                calibration_last_completed_date: {_is_null: false}
                ${filterAsset}
            `;
        }
        if (view === 'Upcoming Calibrations') {
            return `
                removed: {_eq: ${removed}},
                next_calibration_date: {_gt: "now()"},
                is_completed:{_eq: false},
                ${filter},
                ${filterAsset}
            `;
        }
        if (view === 'Past Calibrations') {
            return `
                removed: {_eq: ${removed}},
                next_calibration_date: {_lte: "now()"},
                ${filter},
                ${filterAsset}
            `;
        }
        if (view === 'Calibration History') {
            return `
                removed: {_eq: ${removed}},
                ${filter},
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

                calibration_last_completed_date
        
                upcoming_calibration_list:calibration_record_list(
                  where: {
                    removed: {_eq: false}, 
                    next_calibration_date: {_gt: "now()"}, 
                    is_completed:{_eq: false}
                  }, 
                  order_by: {next_calibration_date: desc_nulls_last}
                ){
                  ${calibration_record_inc_fragment}
                }
                last_calibration_list:calibration_record_list(
                  where: {removed: {_eq: false}, next_calibration_date: {_lte: "now()"}},
                  order_by: {next_calibration_date: desc_nulls_last},
                  limit: 1
                ){
                  ${calibration_record_inc_fragment}
                }
        
                past_calibration_list_aggregate:calibration_record_list_aggregate(
                  where: {removed: {_eq: false}, next_calibration_date: {_lte: "now()"}}
                ){
                  aggregate{
                    count
                  }
                }
                past_completed_before_calibration_list_aggregate:calibration_record_list_aggregate(
                  where: {
                    removed: {_eq: false}, 
                    next_calibration_date: {_lte: "now()"},
                    is_completed_before: {_eq: true}
                  }
                ){
                  aggregate{
                    count
                  }
                }
                past_completed_after_calibration_list_aggregate:calibration_record_list_aggregate(
                  where: {
                    removed: {_eq: false}, 
                    next_calibration_date: {_lte: "now()"},
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
        if (view === 'Upcoming Calibrations') {
            return `
                id
                removed
                next_calibration_interval
                next_calibration_date
                
                asset{
                  ${asset_basic_details_fragment}
                  calibration_record_list(where: {removed: {_eq: false}}){
                    id
                    next_calibration_interval
                    next_calibration_date
                  }
                  ${orgs_fragment}
                }
            `;
        }
        if (view === 'Past Calibrations') {
            return `
                id
                removed
                next_calibration_interval
                next_calibration_date
        
                is_completed
                is_completed_before
                is_completed_after
                completed_date
                completed_day_count
        
                calibration_list(where: {removed: {_eq: false}}, order_by: {calibration_date: desc}){
                  id
                  removed
                  calibrating_company
                  reference_standard
                  certificate_num
                  calibration_date
                }
                
                asset{
                  ${asset_basic_details_fragment}
                  calibration_record_list(where: {removed: {_eq: false}}){
                    id
                    next_calibration_interval
                    next_calibration_date
                  }
                  ${orgs_fragment}
                }
            `;
        }
        if (view === 'Calibration History') {
            return `
                id
                removed
                calibrating_company
                reference_standard
                certificate_num
                calibration_date
        
                scheduled_date
                is_completed_after
                is_completed_before
                completed_day_count
        
                calibration_record_id
                calibration_record{
                  next_calibration_interval
                  next_calibration_date
                  
                  asset{
                    ${asset_basic_details_fragment}
                    calibration_record_list(where: {removed: {_eq: ${removed}}}){
                      id
                      next_calibration_interval
                      next_calibration_date
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
        if (view === 'Upcoming Calibrations') {
            return "order_by: {next_calibration_date: asc}";
        }
        if (view === 'Past Calibrations') {
            return "order_by: {next_calibration_date: asc}";
        }
        if (view === 'Calibration History') {
            return "order_by: {calibration_date: desc}";
        }
    },
    getVariablesAndQueryConfig,
}));