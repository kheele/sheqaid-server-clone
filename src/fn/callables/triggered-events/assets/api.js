
// <editor-fold defaultstate="collapsed" desc="uploadAssetPhotoFilesUpdate">
exports.uploadAssetPhotoFilesUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "asset_photos");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, asset_id, doc, is_default,} = new_item;

	console.log('uploadAssetPhotoFilesUpdate', new_item)

	const new_name = `assets/${asset_id}/${id}/photos`;
	await uploadFilesUpdate({
		id, doc, new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateAssetPhotoMutation($id: asset_photos_pk_columns_input!, $_set: asset_photos_set_input!) {
			      update_asset_photos_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateAssetPhotoMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadAssetDocFilesUpdate">
exports.uploadAssetDocFilesUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "asset_docs");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, asset_id, doc,} = new_item;

	console.log('uploadAssetDocFilesUpdate', new_item)

	const new_name = `assets/${asset_id}/${id}/docs`;
	return await uploadFilesUpdate({
		id, doc, new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateAssetDocMutation($id: asset_docs_pk_columns_input!, $_set: asset_docs_set_input!) {
			      update_asset_docs_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateAssetDocMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadAssetPurchaseInfoFilesUpdate">
exports.uploadAssetPurchaseInfoFilesUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "asset_purchase_info");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, warranty_certificate} = new_item;

	console.log('uploadAssetPurchaseInfoFilesUpdate', new_item)

	const new_name = `assets/purchase-info/${id}/warranty-certificate`;
	await uploadFilesUpdate({
		id,
		doc: warranty_certificate,
		key: 'warranty_certificate',
		new_name,
		onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateAssetPurchaseInfoMutation($id: asset_purchase_info_pk_columns_input!, $_set: asset_purchase_info_set_input!) {
			      update_asset_purchase_info_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateAssetPurchaseInfoMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadAssetMonitoringPlanFuelUsageFilesUpdate">
exports.uploadAssetMonitoringPlanFuelUsageFilesUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "asset_monitoring_plan_fuel_usage");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, monitoring_plan_id, receipt} = new_item;

	console.log('uploadAssetMonitoringPlanFuelUsageFilesUpdate', new_item)

	const new_name = `assets/monitoring-plans/${monitoring_plan_id}/fuel-usage/${id}/receipt`;
	await uploadFilesUpdate({
		id, doc: receipt, key: 'receipt', new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateAssetMonitoringPlanFuelUsageMutation($id: asset_monitoring_plan_fuel_usage_pk_columns_input!, $_set: asset_monitoring_plan_fuel_usage_set_input!) {
			      update_asset_monitoring_plan_fuel_usage_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateAssetMonitoringPlanFuelUsageMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>
