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
require('./register-list');
require('./vehicle-forms');

const findByIdImpl = require("../findByIdImpl");
const listImpl = require('../listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const {
	asset_details_fragment: details_fragment,
	asset_export_details_fragment,
	asset_basic_details_fragment,
	getVariablesAndQueryConfig,
} = require('./commons');
const exportExcelImpl = require("../exportExcelImpl");
const exportExcelOneImpl = require("../exportExcelOneImpl");

const args = {
	name: "Assets",
	tbl: "assets",
};

eventManager.on("assets/findById", findByIdImpl({
	...args,
	details_fragment,
}));

eventManager.on("assets/listByLogged", listImpl({
	...args,
	details_fragment: data => {
		const {data_export} = data;
		return data_export ? asset_export_details_fragment : asset_basic_details_fragment;
	},
	order_by: "order_by: [{asset_detail:{asset_type: asc}}, {asset_detail:{name: asc}},]",
	getVariablesAndQueryConfig,
}));

eventManager.on("assets/dashboard", findByIdDashboardImpl);

eventManager.on("assets/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "Assets",
	listImpl: listImpl({
		...args,
		details_fragment: _data => asset_export_details_fragment,
		order_by: "order_by: [{asset_detail:{asset_type: asc}}, {asset_detail:{name: asc}},]",
		getVariablesAndQueryConfig,
	}),
	mapRow,
}));

eventManager.on("assets/export-excel-one", exportExcelOneImpl({
	currDir: __dirname,
	name: "Asset-Single",
	findByIdImpl,
	mapRow,
}));

eventManager.on("assets/removeMany", async (socket, data) => {
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

function mapRow(item, idx) {
	let {
		id,
		data: {
			created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
			company, client, project, site,
			//
			written_off,
			//1 done
			asset_detail: {
				owning_company,
				name,
				asset_type,
				desc,
				manufacturer,
				model,
				reg_num,
				serial_num,
				location,
				toolkit,
				condition,
				barcode,
				qr_code,
				notes,
			},
			//2 done
			photo_list,
			profile_pic: profile_pic_list,
			//3 done
			responsible_person,
			// //4 done
			// doc_list,
			// //5 done
			// purchase_info,
			// //6 done
			// depreciation,
			// //7 done
			monitoring_plan_list,
			// //8 done
			maintenance_plan_list,
			// //9 done
			calibration_record_list,
			// //10
			// inspection_template_list = [],
			// inspection_list = [],
		}
	} = item;
	
	client = client || company;
	
	//8 done
	const {
		// id,
		next_service_hrs_or_km,
		plan_list,
	} = maintenance_plan_list || {};
	
	//9 done
	const {
		// id,
		next_calibration_interval,
		next_calibration_date,
		calibration_list,
	} = calibration_record_list || {};
	
	return {
		project: project && project.name,
		site: site && site.name,
		
		id,
		asset_type,
		name,
		manufacturer,
		model,
		responsible_person: responsible_person && responsible_person.full_name,
		next_calibration_interval,
		next_calibration_date: Dates.formatDateSQL(next_calibration_date),
		next_service_hrs_or_km,
		owning_company,
		reg_num,
		serial_num,
		location,
		toolkit,
		condition,
		
		status: written_off ? "Inactive" : "Active",
	};
}