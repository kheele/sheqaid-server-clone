const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require('../../listByLoggedImpl');
const {getVariablesAndQueryConfig} = require("./commons");
const {orgs_fragment, asset_basic_details_fragment} = require("../../../../../graphql/Fragments");
const createImpl = require("../../createImpl");
const upsertImpl = require("../../upsertImpl");

const args = {
    name: "AssetCalibrationRecordList",
    tbl: "asset_calibration_record_list",
    details_fragment: `
	    id
        calibration_record_id
        calibrating_company
        reference_standard
        certificate_num
        calibration_date
    `,
    orgs_fragment: null,
};

//<editor-fold desc="calibration_record_inc_fragment">
const calibration_record_inc_fragment = `
    id
    removed
    next_calibration_interval
    next_calibration_date
    asset{
        id
        ${orgs_fragment}
    }
`;
//</editor-fold>

const path = 'assets/calibration-record-list';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
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
                        filter: {removed: {_eq: ${removed}}${filter}}
                    }
                }, 
                calibration_record_list: {removed: {_eq: ${removed}}${filter}}
                ${filterAsset}
            `;
        }
        return `
            removed: {_eq: ${removed}},
            ${filter},
            ${filterAsset}
        `;
    },
    details_fragment: data => {
        const {
            view = 'Asset',
            mon, mon2, mon3,
            written_off: removed = false,
        } = data;
        if (view === 'Asset') {
            return `
                ${asset_basic_details_fragment}
                calibration_record_list(where: {removed: {_eq: ${removed}}}, order_by: {next_calibration_date: desc_nulls_last}){
                    ${calibration_record_inc_fragment}
                }
                calibration_record_list_no_expiry_aggregate:calibration_record_list_aggregate(where: {
                    removed: {_eq: ${removed}}, next_calibration_date: {_is_null: true}
                }){
                    aggregate{
                        count
                    }
                }
                calibration_record_list_expired_aggregate:calibration_record_list_aggregate(where: {
                    removed: {_eq: ${removed}}, next_calibration_date: {_lte: "now()"}
                }){
                    aggregate{
                        count
                    }
                }
                calibration_record_list_mon_expiry_aggregate:calibration_record_list_aggregate(where: {
                    removed: {_eq: ${removed}}, next_calibration_date: {_gt: "now()", _lte: "${mon}"}
                }){
                    aggregate{
                        count
                    }
                }
                calibration_record_list_2mon_expiry_aggregate:calibration_record_list_aggregate(where: {
                    removed: {_eq: ${removed}}, next_calibration_date: {_gt: "${mon}", _lte: "${mon2}"}
                }){
                    aggregate{
                        count
                    }
                }
                calibration_record_list_3mon_expiry_aggregate:calibration_record_list_aggregate(where: {
                    removed: {_eq: ${removed}}, next_calibration_date: {_gt: "${mon2}", _lte: "${mon3}"}
                }){
                    aggregate{
                        count
                    }
                }
                calibration_record_list_4mon_expiry_aggregate:calibration_record_list_aggregate(where: {
                    removed: {_eq: ${removed}}, next_calibration_date: {_gt: "${mon3}"}
                }){
                    aggregate{
                        count
                    }
                }
                ${orgs_fragment}
            `;
        }

        return `
            id
            removed
            next_calibration_interval
            next_calibration_date
            
            asset{
                ${asset_basic_details_fragment}
                calibration_record_list(where: {removed: {_eq: ${removed}}}){
                    id
                    next_calibration_interval
                    ext_calibration_date
                }
                ${orgs_fragment}
            }
        `;
    },
    order_by: data => {
        const {
            view = 'Asset',
            mon, mon2, mon3,
            written_off: removed = false,
        } = data;
        if (view === 'Asset') {
            return "order_by: {asset_detail:{name: asc}}";
        }
        return "order_by: {next_calibration_date: asc}";
    },
    getVariablesAndQueryConfig,
}));
