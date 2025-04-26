require('./calibration-records');
require('./calibration-record-list');
require('./depreciation');
require('./details');
require('./docs');
require('./maintenance-plans');
require('./maintenance-plan-list');
require('./monitoring-plans');
require('./monitoring-plan-fuel-usage-list');
require('./monitoring-plan-working-hrs-or-km-list');
require('./photos');
require('./purchase-info');
require('./registers');
require('./vehicle-forms');

const findByIdImpl = require("../findByIdImpl");
const listByLoggedImpl = require('../listByLoggedImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const {
    asset_details_fragment: details_fragment,
    asset_export_details_fragment,
    asset_basic_details_fragment,
    getVariablesAndQueryConfig, onProcessFormData,
} = require('./commons');
const exportExcelImpl = require("../exportExcelImpl2");
const exportExcelOneImpl = require("../exportExcelOneImpl");
const {createAsset} = require("./create");
const {mapExportRow} = require("./assets_funs");

const args = {
    name: "Assets",
    tbl: "assets",
};

eventManager.on(`assets/create`, createAsset);

eventManager.on("assets/findById", findByIdImpl({
    ...args,
    details_fragment,
}));

eventManager.on("assets/listByLogged", listByLoggedImpl({
    ...args,
    details_fragment: (socket, data) => {
        const {data_export} = data;
        return data_export ? asset_export_details_fragment : asset_basic_details_fragment;
    },
    order_by: "order_by: [{asset_detail:{asset_type: asc}}, {asset_detail:{name: asc}},]",
    getVariablesAndQueryConfig,
}));

eventManager.on("assets/dashboard", findByIdDashboardImpl);

eventManager.on("assets/export-excel", exportExcelImpl({
    ...args,
    currDir: __dirname,
    details_fragment: asset_export_details_fragment,
    order_by: "order_by: [{asset_detail:{asset_type: asc}}, {asset_detail:{name: asc}},]",
    getVariablesAndQueryConfig,
    mapRow: mapExportRow,
}));

eventManager.on("assets/export-excel-one", exportExcelOneImpl({
    currDir: __dirname,
    name: "Asset-Single",
    findByIdImpl,
    mapRow: mapExportRow,
}));

eventManager.on("assets/delete", async (socket, data) => {
    if (!data) return;

    const {
        written_off_store_keeper_signature,
        written_off_manager_signature,
        written_off_reason,
        written_off_comments,
        list,
    } = data;

    return await Promise.all(list.map(async id => {
        const attrs = {
            written_off_store_keeper_signature,
            written_off_manager_signature,
            written_off_reason,
            written_off_comments,
            //
            written_off: true,
        };

        return await updateRelay({
            mutation: `
          mutation updateAssetMutation($id: assets_pk_columns_input!, $_set: assets_set_input!) {
            update_assets_by_pk(pk_columns: $id, _set: $_set) {
              id
            }
          }
        `,
            operationName: "updateAssetMutation",
            id,
            attrs,
        });
    })).then(res => res);
});

// eventManager.on("assets/restore", async (socket, id) => {
// 	if (!id) return;
//
// 	const attrs = {
// 		written_off: false,
// 	};
//
// 	return await updateRelay({
// 		mutation: `
//           mutation updateAssetMutation($id: assets_pk_columns_input!, $_set: assets_set_input!) {
//             update_assets_by_pk(pk_columns: $id, _set: $_set) {
//               id
//             }
//           }
//         `,
// 		operationName: "updateAssetMutation",
// 		id,
// 		attrs,
// 	});
// });