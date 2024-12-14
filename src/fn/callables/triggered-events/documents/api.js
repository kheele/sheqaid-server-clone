
// <editor-fold defaultstate="collapsed" desc="uploadDocUpdate">
exports.uploadDocUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "default_doc_versions");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, documents_id, doc} = new_item;

	console.log('uploadDocUpdate', doc && !!doc.buffer)
	
	//gs://sheqsolve.appspot.com/plugin_sheq_assist_02_IMS_Policies/yWLYv6O5WjhcrhUkbBqB/01/1611218759816.pdf
	const new_name = `record-and-document-control/${documents_id}/v/${id}/doc`;
	await uploadFilesUpdate({
		id,
		doc,
		new_name,
		onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateDocumentVersionMutation($id: default_doc_versions_pk_columns_input!, $_set: default_doc_versions_set_input!) {
			      update_default_doc_versions_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateDocumentVersionMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>
