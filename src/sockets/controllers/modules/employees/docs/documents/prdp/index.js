const findByIdImpl = require("../../../../findByIdImpl");
const exportExcelImpl = require("../../../../exportExcelImpl2");
const listHRDocsByLogged = require('./listHRDocsByLogged');

const {
	getPersonalDocumentsDashboardFragment, personalDocumentsMapResults
} = require("../personalDocsDashboardImpl");

const {findByIdOrgHRPersonalDocumentsDateRangeDashboardStatsImpl} = require("../personalDocsDateRangeDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../../findByIdEmployeeDashboardStatsImpl");
const {inc_fragment} = require("./commons");
const updateImpl = require("../../../../updateImpl");
const {createPrDP} = require("./create");

const args = {
	name: 'PrDPs',
	tbl: 'hr_employees_documents',
	details_fragment: inc_fragment({inc_employee: true}),
	orgs_fragment: null,
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/document-${id}-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/documents/prdp`;

eventManager.on(`${path}/create`, createPrDP);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "PrDP",
	listName: "document_list",
	type: "PrDP",
	mapResults: id => res => res && res.data,
}));

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "PrDP",
	listName: "document_list",
	type: "PrDP"
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "PrDP",
	type: "PrDP",
	details_fragment: getPersonalDocumentsDashboardFragment("PrDP"),
	mapResults: personalDocumentsMapResults,
}));

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgHRPersonalDocumentsDateRangeDashboardStatsImpl({
	name: "PrDP",
	type: "PrDP"
}));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	...args,
	currDir: __dirname,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				project,
				site,
				employee,
				type,
				expiry_date,
				doc,
				removed,
			}
		} = item;

		return {
			idx: idx + 1,
			id,

			project: project && project.name,
			site: site && site.name,

			full_name: employee && employee.full_name,
			id_or_passport: employee && (employee.id_num || employee.passport_num),
			job_position: employee && employee.job_position && employee.job_position.name,
			employment_num: employee && employee.employment_num,

			type,
			expiry_date: Dates.formatDate(expiry_date),
			doc: doc && doc.dlUrls && doc.dlUrls[0],

			status: removed ? "Inactive" : "Active",
		};
	},
}));
