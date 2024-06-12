// <editor-fold defaultstate="collapsed" desc="uploadProductDocsUpdate">
exports.uploadProductDocsUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "sheq_chemical_products");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, sds_doc, hazchem_sheet_doc, risk_assessment_doc} = new_item;

	console.log('uploadProductDocsUpdate', new_item)

	await Promise.all([
		async () => {
			const new_name = `chemicals/products/sds/${id}/docs`;
			await uploadFilesUpdate({
				id, doc: sds_doc, key: 'sds_doc', new_name, onUpdate: async ({id, ...attrs}) => {
					delete attrs.id;

					await updateRelay({
						mutation: `
					    mutation updateDocMutation($id: sheq_chemical_products_pk_columns_input!, $_set: sheq_chemical_products_set_input!) {
					      update_sheq_chemical_products_by_pk(pk_columns: $id, _set: $_set) {
					        id
					      }
					    }
					  `,
						operationName: "updateDocMutation",
						id,
						attrs,
					});
				}
			});
		},
		async () => {
			const new_name = `chemicals/products/hazchem-sheet/${id}/docs`;
			await uploadFilesUpdate({
				id, doc: hazchem_sheet_doc, key: 'hazchem_sheet_doc', new_name, onUpdate: async ({id, ...attrs}) => {
					delete attrs.id;

					await updateRelay({
						mutation: `
					    mutation updateDocMutation($id: sheq_chemical_products_pk_columns_input!, $_set: sheq_chemical_products_set_input!) {
					      update_sheq_chemical_products_by_pk(pk_columns: $id, _set: $_set) {
					        id
					      }
					    }
					  `,
						operationName: "updateDocMutation",
						id,
						attrs,
					});
				}
			});
		},
		async () => {
			const new_name = `chemicals/products/risk-assessment/${id}/docs`;
			await uploadFilesUpdate({
				id, doc: risk_assessment_doc, key: 'risk_assessment_doc', new_name, onUpdate: async ({id, ...attrs}) => {
					delete attrs.id;

					await updateRelay({
						mutation: `
					    mutation updateDocMutation($id: sheq_chemical_products_pk_columns_input!, $_set: sheq_chemical_products_set_input!) {
					      update_sheq_chemical_products_by_pk(pk_columns: $id, _set: $_set) {
					        id
					      }
					    }
					  `,
						operationName: "updateDocMutation",
						id,
						attrs,
					});
				}
			});
		},
	]);
};
// </editor-fold>