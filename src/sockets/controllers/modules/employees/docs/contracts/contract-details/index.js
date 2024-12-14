const findByIdImpl = require("../../../../findByIdImpl");
const updateImpl = require("../../../../updateImpl");
const createImpl = require("../../../../createImpl");

const args = {
    name: 'ContractDetails',
    tbl: 'hr_employees_docs_contracts_details',
    details_fragment: `
        id
        contract_type
        daily_working_hours
        end_of_trial_period
        end_time
        expiry_date
        notes
        start_date
        start_time
    `,
    orgs_fragment: null,
};

const path = `employees/docs/contracts/contract-details`;

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
