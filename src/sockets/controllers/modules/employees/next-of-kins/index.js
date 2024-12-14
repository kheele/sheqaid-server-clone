const findByIdImpl = require("../../findByIdImpl");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");

const args = {
    name: "EmployeeNextOfKin",
    tbl: "hr_employees_next_of_kin",
    details_fragment: `
        id
        created_at
        fname
        lname
        phone1
        phone2
        relationship
        employee_id
        employee{
            id
        }
    `,
    orgs_fragment: null,
    // order_by: `{name: asc}`,
    // getVariablesAndQueryConfig,
};

const path = 'employees/next-of-kins';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
