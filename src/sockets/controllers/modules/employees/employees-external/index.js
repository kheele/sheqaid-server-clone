const findByIdImpl = require("../../findByIdImpl");
const {employee_external_details_fragment} = require("./commons");

const args = {
    name: "EmployeeExternal",
    tbl: "hr_employees_external",
    details_fragment: employee_external_details_fragment,
    // order_by: `{name: asc}`,
    // getVariablesAndQueryConfig,
};

const path = 'employees-external';

eventManager.on(`${path}/findById`, findByIdImpl(args));
