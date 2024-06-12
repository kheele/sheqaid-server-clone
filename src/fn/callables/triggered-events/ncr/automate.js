const path = require("path");
const fs = require("fs-extra");
const mime = require("mime");
const {onReadAsJson} = require("../../excel/api");

exports.run = async () => {
	const filename = path.join(__dirname, 'ECO-NCR/Feb 2023 Ecco Aggregates.xlsx');
	const base64 = fs.readFileSync(filename, {encoding: 'base64'});
	const dataUri = `data:${mime.getType(filename)};base64,${base64}`;

	const data = (await onReadAsJson({
		path: dataUri,
		validHeaderNames: [
			{key: "idx", value: ["REF NO"]},
			{key: "desc", value: ["REPORT A NON CONFORMANCE / DESCRIPTION"]},
			{key: "document_list", value: ["PHOTOS"]},
			{key: "responsible_party_list", value: ["RESPONSIBLE PARTY"]},
			{key: "assigned_person_list", value: "PERSON/S ASSIGNED TO:"},
			// {key: "process", value: "ACTION/PROCEDURE : STANDARDS ARE MET WHEN THE CRITERIA OR ACTIONS BELOW ARE IMPLEMENTED AND MAINTAINED"},
			{key: "allocation", value: "Allocation"},
			{key: "priority", value: "Priority"},
			{key: "progress_list", value: "Progress"},//status_progress
			{key: "document_proof_list", value: "PHOTO / DOCUMENT PROOF OF CORRECTION"},
			{key: "completed_date", value: "Completion Date"},
		],
	})).map(v => {
		let {
			idx,//
			priority,//[Important]//
			allocation,//[NCR, Finding]//
			desc,//
			completed_date,//
			process,
			responsible_party_list,//[Client]//
			assigned_person_list,
			progress_list,//[In progress, Not Started]
			// document_list,//
		} = v;

		const filenameProof = path.join(__dirname, `ECO-NCR/Feb 2023 Ecco Aggregates/proof-${idx}.jpg`);
		const filenameIncident = path.join(__dirname, `ECO-NCR/Feb 2023 Ecco Aggregates/${idx}.jpg`);

		let docProof, docIncident;
		try{
			docProof = filenameProof && fs.readFileSync(filenameProof, {encoding: 'base64url'});
			docIncident = filenameIncident && fs.readFileSync(filenameIncident, {encoding: 'base64url'});
		} catch (e) {}

		const assigned_job_position_list = assigned_person_list ? {
			data: []
		} : null;

		assigned_person_list = assigned_person_list ? {
			data: []
		} : null;

		console.log('progress_list', progress_list)

		const data = {
			//0
			site_id: 82,
			project_id: 10,
			client_id: 4,
			company_id: 1,
			//1
			// type,
			priority: priority === 'Important' ? 'High' : priority,
			allocation,
			// source,
			// [sources[source]]: selected_source && selected_source.id,
			//2
			desc,
			// process,
			//3
			// due_date: Dates.formatTimestampSQL(due_date),
			// responsible_person_id: responsible_person && responsible_person.id,
			responsible_party_list: {
				data: responsible_party_list ? [{value: responsible_party_list.replaceAll(' ','')}] : null,
			},
			assigned_job_position_list: {
				data: [
					...(assigned_job_position_list || []).map(({id: job_position_id}) => ({job_position_id})),
				],
			},
			assigned_person_list: {
				data: [
					...(assigned_person_list || []).map(({id: employee_id}) => ({employee_id})),
				],
			},
			// approving_person_id: approving_person && approving_person.id,
			//4
			document_list: {
				data: [
					docProof ? {type: 'Document Proof', doc: {path: docProof},} : null,
					docIncident ? {type: 'Document Incident', doc: {path: docIncident},} : null,
				].filter(v => !!v),
			},
			//5
			comments: process,
			// remarks,
			//6
			progress_list: {
				data: (isArray(progress_list) ? progress_list : isString(progress_list) ? [{'status_progress': progress_list}] : []).map(({date, ...others}) => ({
					...others,
					date: Dates.formatDateSQL(date),
				})),
			},
			//7
			status_acceptance,
			status_progress,
			// result,
			completed_date: Dates.formatTimestampSQL(completed_date),
			// additional_notes
		};

		console.log(data)
		return v;
	});

	console.log('data', data)
};