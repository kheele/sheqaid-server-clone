require("./contract-details");
require("./salary-info");

const findByIdImpl = require("../../../findByIdImpl");
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
const createImpl = require("../../../createImpl");

const args = {
    name: 'Contract',
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

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
    name: "Contracts",
    listName: "contract_list",
    mapResults: hrDocsDashboardMapResults,
    isContract: true,
}));

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
    name: "Contracts",
    listName: "contract_list",
    isContract: true,
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
    name: "Contracts",
    listName: "contract_list",
    details_fragment: getHRDocsDashboardFragment("contract_list", true),
    mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
    name: "Contracts",
    listName: "contract_list",
    details_fragment: getDateRangeDashboardFragment("contract_list", true),
}));