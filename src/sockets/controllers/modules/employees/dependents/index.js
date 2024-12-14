const findByIdImpl = require("../../findByIdImpl");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");

const args = {
    name: "EmployeeDependent",
    tbl: "hr_employees_dependents",
    details_fragment: `
        id
        created_at
        fname
        lname
        dob
        gender
        employee_id
        employee{
            id
        }
    `,
    orgs_fragment: null,
    // order_by: `{name: asc}`,
    // getVariablesAndQueryConfig,
};

const path = 'employees/dependents';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
