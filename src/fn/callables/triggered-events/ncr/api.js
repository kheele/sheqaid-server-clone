// <editor-fold defaultstate="collapsed" desc="uploadNCRDocsUpdate">
exports.uploadNCRDocsUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "sheq_non_conformance_docs");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, non_conformance_id, doc, type} = new_item;

	console.log('uploadIncidentDocsUpdate', new_item)

	const new_name = `ncr/${non_conformance_id}/${id}/docs`;
	await uploadFilesUpdate({
		id, doc, new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateNCRDocMutation($id: sheq_non_conformance_docs_pk_columns_input!, $_set: sheq_non_conformance_docs_set_input!) {
			      update_sheq_non_conformance_docs_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateNCRDocMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>