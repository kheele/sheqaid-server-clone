const listByLoggedImpl = require("../../listByLoggedImpl");
const {findByIdOrgHRDashboardStatsImpl} = require("./findByIdOrgHRDashboardStatsImpl");
const {employee_details_fragment, employee_details_list_fragment, getVariablesAndQueryConfig,
    employee_export_details_fragment
} = require("./commons");
const {getVariablesAndQueryConfig: getVariablesAndQueryConfigByPPEIssue, employee_details_list_by_ppe_fragment} = require('./commons-ppe-issue');
const {createEmployee} = require("./create");
const {updateEmployee} = require("./update");
const {findByIdEmployee, loginUserStep1ByUsername, findByUsernameUserSetupBiometric} = require("./query_employees");
const {createEmployeeImported} = require("./createImported");
const exportExcelImpl = require("../../exportExcelImpl2");
const {mapExportRow} = require("./employee_funcs");
const {processFileImport} = require("./processFileImport");

const args = {
    name: "Employees",
    tbl: "hr_employees",
    details_fragment: employee_details_fragment,
    order_by: `order_by: {employment_num: asc}`,
    getVariablesAndQueryConfig,
};

const path = 'employees';

eventManager.on(`${path}/create`, createEmployee);

eventManager.on(`${path}/imported/create`, createEmployeeImported);

eventManager.on(`${path}/processFileImport`, processFileImport);

eventManager.on(`${path}/update`, updateEmployee);

eventManager.on(`${path}/findById`, findByIdEmployee);

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: employee_details_list_fragment,
}));

eventManager.on(`${path}/listByPPEIssue`, listByLoggedImpl({
    ...args,
    name: ({view}) => view.replace(" ", ""),
    tbl: ({view}) => {
        if(view === "Employee") {
            return "hr_employees";
        }
        if(view === "Team") {
            return "default_teams";
        }
        if(view === "Department") {
            return "default_departments";
        }
        if(view === "Job Position") {
            return "default_job_positions";
        }
        if(view === "PPE Type") {
            return "ppe_types";
        }
    },
    where: ({data, filters}) => {
        const {
            view,
        } = data;

        let {filter} = filters;

        switch(view) {
            case "Employee":
                return `
                    removed: {_eq: false},
					ppe_type_list_aggregate: {count: {filter: {ppe_type: {removed:{_eq: false}}}, predicate: {_gt: 0}}},
					${filter}
                `;
            case "Team":
                return `
                    status: {_eq: "Active"},
					ppe_type_list_aggregate: {count: {filter: {ppe_type: {removed:{_eq: false}}}, predicate: {_gt: 0}}},
					${filter}
                `;
            case "Department":
                return `
                    removed: {_eq: false},
					ppe_type_list_aggregate: {count: {filter: {ppe_type: {removed:{_eq: false}}}, predicate: {_gt: 0}}},
					${filter}
                `;
            case "Job Position":
                return `
                    removed: {_eq: false},
					ppe_type_list_aggregate: {count: {filter: {ppe_type: {removed:{_eq: false}}}, predicate: {_gt: 0}}},
					${filter}
                `;
            case "PPE Type":
                return `
                    removed: {_eq: false},
					${filter}
                `;
        }
    },
    order_by: ({view}) => {
        switch(view) {
            case "Employee":
                return "order_by: {lname: asc}";
            case "Team":
            case "Department":
            case "Job Position":
            case "PPE Type":
                return "order_by: {name: asc}";
        }
    },
    details_fragment: employee_details_list_by_ppe_fragment,
    getVariablesAndQueryConfig: getVariablesAndQueryConfigByPPEIssue,
}));

eventManager.on(`${path}/dashboard`, findByIdOrgHRDashboardStatsImpl());

eventManager.on(`${path}/loginUserStep1ByUsername`, loginUserStep1ByUsername);

eventManager.on(`${path}/findByUsernameUserSetupBiometric`, findByUsernameUserSetupBiometric);

eventManager.on(`${path}/export-excel`, exportExcelImpl({
    ...args,
    currDir: __dirname,
    details_fragment: employee_export_details_fragment({incContractors: true}),
    mapRow: mapExportRow,
}));
