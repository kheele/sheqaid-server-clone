require('./definitions');
require('./items');

const findByIdImpl = require("./findByIdImpl");
const listImpl = require('./listImpl');
const exportExcelImpl = require('../exportExcelImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("audits/findById", findByIdImpl);

eventManager.on("audits/listByLogged", listImpl);

eventManager.on("audits/dashboard", findByIdDashboardImpl);

eventManager.on("audits/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "Audits",
	listImpl,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at, removed,
				company, client, project, site,
				
				scope,
				date,
				type,
				//2
				representative_list,
				//3
				auditor_list,
				//4
				definition_list,
				//5
				list,
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			id,
			
			project: project && project.name,
			site: site && site.name,
			
			scope,
			type,
			date: Dates.formatDateSQL(date),
			representative_list: (representative_list || []).map((
				{
					employee,
					other_person
				}
			) => (employee || other_person).full_name).join(', '),
			auditor_list: (auditor_list || []).map((
				{
					employee,
					other_person
				}
			) => (employee || other_person).full_name).join(', '),
			definition_list: (definition_list || []).map(({title, desc}, n) => `${n + 1}) ${title}: ${desc}`).join(', '),
			
			status: removed ? "Inactive" : "Active",
		};
	},
}));
