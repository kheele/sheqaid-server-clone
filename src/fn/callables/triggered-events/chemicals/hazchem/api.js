// <editor-fold defaultstate="collapsed" desc="uploadHazchemDocsUpdate">
exports.uploadHazchemDocsUpdate = async (body) => {
	// await authorize();

	const data = getTriggeredEventsData(body, "sheq_chemical_hazchem_sheets");
	if(!data){
		return;
	}

	const {new_item} = data;
	let {id, doc} = new_item;

	console.log('uploadHazchemDocsUpdate', new_item)

	const new_name = `chemicals/hazchem-sheets/${id}/docs`;
	await uploadFilesUpdate({id, doc, new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateDocMutation($id: sheq_chemical_hazchem_sheets_pk_columns_input!, $_set: sheq_chemical_hazchem_sheets_set_input!) {
			      update_sheq_chemical_hazchem_sheets_by_pk(pk_columns: $id, _set: $_set) {
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

// <editor-fold defaultstate="collapsed" desc="uploadHazchemPrecautionPhotosUpdate">
exports.uploadHazchemPrecautionPhotosUpdate = async (body) => {
	// await authorize();

	const data = getTriggeredEventsData(body, "sheq_chemical_hazchem_sheet_docs");
	if(!data){
		return;
	}

	const {new_item} = data;
	let {id, hazchem_sheet_id, doc, type} = new_item;

	console.log('uploadHazchemPrecautionPhotosUpdate', new_item)

	const new_name = `chemicals/hazchem-sheets/${hazchem_sheet_id}/${id}/${type}/docs`;
	await uploadFilesUpdate({id, doc, new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateDocMutation($id: sheq_chemical_hazchem_sheet_docs_pk_columns_input!, $_set: sheq_chemical_hazchem_sheet_docs_set_input!) {
			      update_sheq_chemical_hazchem_sheet_docs_by_pk(pk_columns: $id, _set: $_set) {
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
