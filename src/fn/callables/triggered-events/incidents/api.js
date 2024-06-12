
// <editor-fold defaultstate="collapsed" desc="uploadIncidentDocsUpdate">
exports.uploadIncidentDocsUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "sheq_incident_investigation_docs");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, incident_id, doc,} = new_item;

	console.log('uploadIncidentDocsUpdate', new_item)

	const new_name = `incidents/${incident_id}/${id}/docs`;
	await uploadFilesUpdate({id, doc, new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateIncidentDocMutation($id: sheq_incident_investigation_docs_pk_columns_input!, $_set: sheq_incident_investigation_docs_set_input!) {
			      update_sheq_incident_investigation_docs_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateIncidentDocMutation",
				id,
				attrs,
			});
		}});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadIncidentVehicleThirdPartyDocsUpdate">
exports.uploadIncidentVehicleThirdPartyDocsUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "sheq_incident_investigation_vehicle_third_party_docs");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, vehicle_details_id, doc,} = new_item;

	console.log('uploadIncidentVehicleThirdPartyDocsUpdate', new_item)

	const new_name = `incidents/vehicle-details/${vehicle_details_id}/${id}/docs`;
	await uploadFilesUpdate({id, doc, new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateIncidentVehicleThirdPartyDocMutation($id: sheq_incident_investigation_vehicle_third_party_docs_pk_columns_input!, $_set: sheq_incident_investigation_vehicle_third_party_docs_set_input!) {
			      update_sheq_incident_investigation_vehicle_third_party_docs_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateIncidentVehicleThirdPartyDocMutation",
				id,
				attrs,
			});
		}});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadIncidentInvestigationDocsUpdate">
exports.uploadIncidentInvestigationDocsUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "sheq_incident_investigation_investigations_docs");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, investigation_id, doc,} = new_item;

	const new_name = `incidents/investigations/${investigation_id}/${id}/docs`;
	await uploadFilesUpdate({id, doc, new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateIncidentInvestigationDocMutation($id: sheq_incident_investigation_investigations_docs_pk_columns_input!, $_set: sheq_incident_investigation_investigations_docs_set_input!) {
			      update_sheq_incident_investigation_investigations_docs_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateIncidentInvestigationDocMutation",
				id,
				attrs,
			});
		}});
};
// </editor-fold>
