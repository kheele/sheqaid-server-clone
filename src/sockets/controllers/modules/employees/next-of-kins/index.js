const findByIdImpl = require("../../findByIdImpl");
const updateImpl = require("../../updateImpl");
const {createNextOfKin} = require("./create");

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
    skipOrgs: true,
    skipUsers: true,
    // order_by: `{name: asc}`,
    // getVariablesAndQueryConfig,
};

const path = 'employees/next-of-kins';

eventManager.on(`${path}/create`, createNextOfKin);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
