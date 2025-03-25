const findByIdImpl = require("../../findByIdImpl");
const updateImpl = require("../../updateImpl");
const {createDependent} = require("./create");

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
    skipOrgs: true,
    skipUsers: true,
    // order_by: `{name: asc}`,
    // getVariablesAndQueryConfig,
};

const path = 'employees/dependents';

eventManager.on(`${path}/create`, createDependent);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
