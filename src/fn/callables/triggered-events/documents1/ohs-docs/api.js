
// <editor-fold defaultstate="collapsed" desc="uploadOHSDocsUpdate">
exports.uploadOHSDocsUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "ohs_documents");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, doc} = new_item;

	console.log('uploadOHSDocsUpdate', new_item)
	
	const new_name = `documents/ohs-docs/${id}/doc`;
	await uploadFilesUpdate({
		id,
		doc,
		new_name,
		onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateOHSDocsMutation($id: ohs_documents_pk_columns_input!, $_set: ohs_documents_set_input!) {
			      update_ohs_documents_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateOHSDocsMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>
