require("./contract-details");
require("./salary-info");

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
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../findByIdEmployeeDashboardStatsImpl");
const {createContract} = require("./create");

const args = {
    name: 'Contracts',
    tbl: 'hr_employees_docs_contracts',
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => {
        const d = Dates.formatTimestamp(new Date());
        const path = `employees/${employee.id}/docs/contracts/${id}`;
        return {
            new_names: [
                `${path}/Contract-doc-${d}`,
                `${path}/Contract-job-profile_doc-${d}`,
            ],
            keys: ['doc', 'job_profile_doc'],
        };
    },
};

const path = `employees/docs/contracts`;

eventManager.on(`${path}/create`, createContract);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
    name: 'Contracts',
    listName: "contract_list",
    mapResults: hrDocsDashboardMapResults,
    isContract: true,
}));

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
    name: 'Contracts',
    listName: "contract_list",
    isContract: true,
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
    name: 'Contracts',
    listName: "contract_list",
    details_fragment: getHRDocsDashboardFragment("contract_list", true),
    mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
    name: 'Contracts',
    listName: "contract_list",
    details_fragment: getDateRangeDashboardFragment("contract_list", true),
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

                contract_details,
                salary_info,

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

            contract_type: contract_details && contract_details.contract_type,
            payment_type: salary_info && salary_info.payment_type,
            salary_interval: salary_info && salary_info.salary_interval,

            expiry_date: Dates.formatDate(expiry_date),
            doc: doc && doc.dlUrls && doc.dlUrls[0],

            status: removed ? "Inactive" : "Active",
        };
    },
}));
