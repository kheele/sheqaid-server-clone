require('./progress');
require('./ProxyNCRAssignedPerson');
require('./ProxyNCRAssignedJobPosition');
require('./ProxyNCRAssignedUser');
require('./ProxyNCRApprovingPerson');
require('./ProxyNCRResponsibleParty');
require('./ProxyNCRDocument');

const createNCR = require("./create");
const updateImpl = require("../updateImpl");
const findByIdImpl = require("../findByIdImpl");
const listByLoggedImpl = require('../listByLoggedImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const exportExcelImpl = require("../exportExcelImpl2");
const exportExcelOneImpl = require("../exportExcelOneImpl");
const {ncr_details_fragment: details_fragment} = require("./commons");

const args = {
	name: "NCR",
	tbl: "sheq_non_conformances",
	details_fragment,
};

eventManager.on("ncr/create", createNCR);

eventManager.on("ncr/update", updateImpl(args));

eventManager.on("ncr/findById", findByIdImpl(args));

eventManager.on("ncr/listByLogged", listByLoggedImpl(args));

eventManager.on("ncr/dashboard", findByIdDashboardImpl);

eventManager.on("ncr/export-excel", exportExcelImpl({
	...args,
	name: "Non-Conformance",
	currDir: __dirname,
	mapRow,
}));

eventManager.on("ncr/export-excel-one", exportExcelOneImpl({
	currDir: __dirname,
	name: "Non-Conformance-Single",
	findByIdImpl,
	mapRow,
}));

function mapRow(item, idx) {
	let {
		id,
		data: {
			created_at,
			company, client, project, site,
			//1 done
			type,
			priority,
			allocation,
			desc, process,
			due_date,
			responsible_party_list,
			assigned_job_position_list,
			assigned_person_list,
			assigned_user_list,
			approving_person,
			document_list,
			document_proof_list,
			comments, remarks,
			progress_list,
			status_acceptance,
			status_progress,
			result,
			completed_date,
			additional_notes,
			//
			removed,
		}
	} = item;
	
	client = client || company;

	const assigned_to_list = [
		...(assigned_person_list ? assigned_person_list.map(({employee, employee_other}) => (employee || employee_other).full_name) : []),
		...(assigned_user_list ? assigned_user_list.map(({user: {full_name}}) => full_name) : []),
	];
	
	return {
		project: project && project.name,
		site: site && site.name,
		
		id,
		type,
		priority,
		allocation,
		desc,
		process,
		due_date: Dates.formatDateSQL(due_date),
		responsible_party_list: (responsible_party_list || []).map(({value}) => value).join(', '),
		assigned_job_position_list: (assigned_job_position_list || []).map(({job_position}) => job_position.name).join(', '),
		assigned_to_list,
		approving_person: approving_person && approving_person.full_name,
		document_list: (document_list || []).filter(({doc}) => !!doc && doc.dlUrls).map(({doc}) => doc.dlUrls[0]).join(', '),
		document_proof_list: (document_proof_list || []).filter(({doc}) => !!doc && doc.dlUrls).map(({doc}) => doc.dlUrls[0]).join(', '),
		comments,
		remarks,
		progress_list: (progress_list || []).map(({date}) => Dates.formatDateSQL(date)).join(', '),
		status_acceptance,
		status_progress,
		result,
		completed_date: Dates.formatDateSQL(completed_date),
		additional_notes,
		//
		status: removed ? "Inactive": "Active",
	};
}