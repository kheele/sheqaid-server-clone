
// <editor-fold defaultstate="collapsed" desc="uploadPPEItemProfilePicUpdate">
exports.uploadPPEItemProfilePicUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "ppe_items");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, profile_pic} = new_item;

	console.log('uploadPPEItemProfilePicUpdate', new_item)

	const new_name = `ppes/ppe-items/${id}/ppe-item-doc`;
	await uploadFilesUpdate({
		id,
		doc: profile_pic,
		key: 'profile_pic',
		new_name,
		onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updatePPEItemMutation($id: ppe_items_pk_columns_input!, $_set: ppe_items_set_input!) {
			      update_ppe_items_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updatePPEItemMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>
