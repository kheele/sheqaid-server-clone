require('./definitions');
require('./items');

const findByIdImpl = require("../findByIdImpl");
const exportExcelImpl = require('../exportExcelImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const {audit_details_fragment, getVariablesAndQueryConfig} = require("./commons");
const createImpl = require("../createImpl");
const updateImpl = require("../updateImpl");
const listByLoggedImpl = require("../listByLoggedImpl");

const args = {
	name: "Audits",
	tbl: "sheq_compliance_audits",
	order_by: "order_by: {date: desc}",
	details_fragment: audit_details_fragment,
	getVariablesAndQueryConfig,
};

const path = "audits";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/dashboard`, findByIdDashboardImpl);

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	...args,
	currDir: __dirname,
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
