const findByIdImpl = require("../../../findByIdImpl");
const exportExcelImpl = require("../../../exportExcelImpl2");
const listHRDocsByLogged = require('./listHRDocsByLogged');
const {
    getHRDocsDashboardFragment, hrDocsDashboardMapResults
} = require("../hrDocsDashboardImpl");

const {
    getDateRangeDashboardFragment,
} = require("../hrDocsDateRangeDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const updateImpl = require("../../../updateImpl");
const {inc_fragment} = require("./commons");
const {findByIdOrgDashboardStatsImpl} = require("../../../findByIdOrgDashboardStatsImpl");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../findByIdEmployeeDashboardStatsImpl");
const {createWarning} = require("./create");

const args = {
    name: 'Warnings',
    tbl: 'hr_employees_docs_warnings',
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/warnings/${id}/Warning-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
        key: 'doc',
    }),
};

const path = `employees/docs/warnings`;

eventManager.on(`${path}/create`, createWarning);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`employees/docs/warnings/dashboard/single`, findByIdEmployeeDashboardStats({
    name: "Warnings",
    listName: "warning_list",
    mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/warnings/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
    name: "Warnings",
    listName: "warning_list"
}));

eventManager.on(`employees/docs/warnings/dashboard`, findByIdOrgDashboardStatsImpl({
    name: "Warnings",
    listName: "warning_list",
    details_fragment: getHRDocsDashboardFragment("warning_list"),
    mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`employees/docs/warnings/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
    name: "Warnings",
    listName: "warning_list",
    details_fragment: getDateRangeDashboardFragment("warning_list"),
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
                date,
                issued_by,
                witness_list,
                type,
                details,
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

            date: Dates.formatDate(date),
            issued_by: issued_by && issued_by.full_name,
            witness_list: (witness_list || []).filter(v => !!v).filter((
                {
                    witness,
                    witness_external
                }
            ) => witness || witness_external).map((
                {
                    witness,
                    witness_external
                }
            ) => (witness || witness_external).full_name).join(", "),
            type,
            details,
            expiry_date: Dates.formatDate(expiry_date),
            doc: doc && doc.dlUrls && doc.dlUrls[0],

            status: removed ? "Inactive" : "Active",
        };
    },
}));
