const findByIdImpl = require("../../../../findByIdImpl");
const updateImpl = require("../../../../updateImpl");
const {createBankingDetail} = require("./create");

const args = {
    name: "EmployeeDocBankingDetail",
    tbl: "hr_employees_banking_details",
    details_fragment: `
        id
        created_at
        is_default
        name

        account_num
        branch
        code
        doc
        employee_id
        employee{
            id
        }
    `,
    orgs_fragment: null,
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/banking_detail-${id}-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
};

const path = 'employees/documents/banking-details';

eventManager.on(`${path}/create`, createBankingDetail);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
