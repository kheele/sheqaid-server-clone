const findByIdImpl = require("../../../findByIdImpl");
const exportExcelImpl = require("../../../exportExcelImpl2");
const listHRDocsByLogged = require('./listHRDocsByLogged');
const {
	getHRDocsDashboardFragment, hrDocsDashboardMapResults
} = require("../hrDocsDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const updateImpl = require("../../../updateImpl");
const {inc_fragment} = require("./commons");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
const {getDateRangeDashboardFragment} = require("../hrDocsDateRangeDashboardImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../findByIdEmployeeDashboardStatsImpl");
const {createCounselling} = require("./create");

const args = {
	name: 'Counsellings',
	tbl: 'hr_employees_docs_counsellings',
	details_fragment: inc_fragment({inc_employee: true}),
	uploadUpdate: ({id, data: {employee}}) => ({
		new_name: `employees/${employee.id}/docs/counsellings/${id}/Counselling-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
};

const path = `employees/docs/counsellings`;

eventManager.on(`${path}/create`, createCounselling);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
	name: 'Counsellings',
	listName: "counselling_list",
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: 'Counsellings',
	listName: "counselling_list"
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
	name: 'Counsellings',
	listName: "counselling_list",
	details_fragment: getHRDocsDashboardFragment("counselling_list"),
	mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: 'Counsellings',
	listName: "counselling_list",
	details_fragment: getDateRangeDashboardFragment("counselling_list"),
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

				responsible_person,
				corrective_actions,
				counselling_hrs_to_complete,
				incident_desc,
				reasons,
				types,

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

			responsible_person: responsible_person && responsible_person.full_name,
			types: (types || []).join(', '),
			reasons: (reasons || []).join(', '),

			expiry_date: Dates.formatDate(expiry_date),
			doc: doc && doc.dlUrls && doc.dlUrls[0],

			status: removed ? "Inactive" : "Active",
		};
	},
}));