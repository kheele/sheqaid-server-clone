
// <editor-fold defaultstate="collapsed" desc="uploadSDSDocsUpdate">
exports.uploadSDSDocsUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "sheq_chemical_sds");
	if(!data){
		return;
	}

	const {new_item} = data;
	let {id, doc} = new_item;

	console.log('uploadSDSDocsUpdate', new_item)

	const new_name = `chemicals/sds/${id}/docs`;
	await uploadFilesUpdate({id, doc, new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateDocMutation($id: sheq_chemical_sds_pk_columns_input!, $_set: sheq_chemical_sds_set_input!) {
			      update_sheq_chemical_sds_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateDocMutation",
				id,
				attrs,
			});
		}});
};
// </editor-fold>
