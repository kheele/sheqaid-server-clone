const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');

const {hira_sop_details_fragment: details_fragment} = require('./commons');
const exportExcelImpl = require("../../exportExcelImpl");
const updateImpl = require("../../updateImpl");
const createImpl = require("../../createImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
	name: "SOP",
	tbl: "hira_sop",
	details_fragment,
};

const path = 'hira-and-opportunities/sop';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	currDir: __dirname,
	name: "SOP",
	listImpl,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
				company, client, project, site,
				removed,
				category,
				risk_level,
				location,
				prepared_by,
				date_created,
				date_revised,
				doc,
				risk_list,
				close_down_list,
				safety_pre_requesite_list,
				custom_safety_pre_requesite_list,
				procedure_list,
				key_point_list,
				operation_list,
				other,
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			id,
			
			project: project && project.name,
			site: site && site.name,
			
			category,
			risk_level,
			location,
			prepared_by: prepared_by && prepared_by.full_name,
			date_created: Dates.formatDateSQL(date_created),
			date_revised: Dates.formatDateSQL(date_revised),
			doc: doc && doc.dlUrls && doc.dlUrls[0],
			risk_list: (risk_list || []).map(({text}) => text).join(', '),
			close_down_list: (close_down_list || []).map(({text}) => text).join(', '),
			safety_pre_requesite_list: (safety_pre_requesite_list || []).filter(({checked}) => checked).map(({desc}) => desc).join(', '),
			custom_safety_pre_requesite_list: (custom_safety_pre_requesite_list || []).map(({text}) => text).join(', '),
			procedure_list: (procedure_list || []).map(({text}) => text).join(', '),
			key_point_list: (key_point_list || []).map(({text}) => text).join(', '),
			operation_list: (operation_list || []).map(({text}) => text).join(', '),
			other,
			status: removed ? "Inactive": "Active",
		};
	},
}));
