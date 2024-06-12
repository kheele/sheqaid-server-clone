
// <editor-fold defaultstate="collapsed" desc="uploadPPETypeProfilePicUpdate">
exports.uploadPPETypeProfilePicUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "ppe_types");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, profile_pic} = new_item;

	// console.log('uploadPPETypeProfilePicUpdate', new_item)

	const new_name = `ppes/${id}/ppe-doc`;
	await uploadFilesUpdate({
		id,
		doc: profile_pic,
		key: 'profile_pic',
		new_name,
		onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updatePPEMutation($id: ppe_types_pk_columns_input!, $_set: ppe_types_set_input!) {
			      update_ppe_types_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updatePPEMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>
