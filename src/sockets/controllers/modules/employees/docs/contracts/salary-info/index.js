const findByIdImpl = require("../../../../findByIdImpl");
const updateImpl = require("../../../../updateImpl");
const createImpl = require("../../../../createImpl");

const args = {
    name: 'ContractSalaryInfo',
    tbl: 'hr_employees_docs_contracts_salary_info',
    details_fragment: `
        id
        deductible_list{
            id
            created_at
            text
            value
        }
        payment_type
        salary
        salary_interval
        wage
    `,
    orgs_fragment: null,
};

const path = `employees/docs/contracts/salary-info`;

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
